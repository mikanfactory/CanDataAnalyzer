package controller

import (
	"bufio"
	"encoding/csv"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Marker control request of Marker
type Marker struct{}

const (
	target      = "021021K1KAm-cache.csv"
	headerLines = 2
)

var statusToFilename = map[string]string{
	"green":    "/icon/green_car.png",
	"yellow":   "/icon/yellow_car.png",
	"red":      "/icon/red_car.png",
	"up":       "/icon/up.png",
	"down":     "/icon/down.png",
	"right":    "/icon/right.png",
	"left":     "/icon/left.png",
	"straight": "/icon/straight.png",
	"stop":     "/icon/stop_car.png",
	"empty":    "/icon/empty.png",
}

func (m *Marker) GetSpeed(c echo.Context) error {
	file, err := os.Open("data/" + target)
	if err != nil {
		log.Fatal(err)
	}

	r := csv.NewReader(bufio.NewReader(file))
	r.LazyQuotes = true
	records, err := r.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	markers := []model.Marker{}
	getImage := imageGenerator(records[0])
	getPosition := positionGenerator(records[0])
	getComponents := componentsGenerator(records[0])
	for i, record := range records {
		if i < headerLines {
			continue
		}

		marker := model.Marker{
			ID:         int64(i),
			Image:      getImage(record),
			Position:   getPosition(record),
			Components: getComponents(record),
		}

		markers = append(markers, marker)
	}

	data := model.Markers{Name: "Speed", Markers: markers}

	return c.JSON(http.StatusOK, data)
}

func componentsGenerator(header []string) func(record []string) []string {
	nameList := header

	return func(record []string) []string {
		components := []string{}
		for i, component := range record {
			cmp := "<div class='feature'>" + nameList[i] + ": " + component + "</div>"
			components = append(components, cmp)
		}

		return components
	}
}

func positionGenerator(header []string) func(record []string) model.Position {
	nameToIndexMap := createNameToIndexMap(header)

	return func(record []string) model.Position {
		latI := nameToIndexMap["GPSLatitude Ave"]
		lngI := nameToIndexMap["GPSLongtitude Ave"]
		lat, _ := strconv.ParseFloat(record[latI], 64)
		lng, _ := strconv.ParseFloat(record[lngI], 64)

		return model.Position{Latitude: lat, Longutitude: lng}
	}
}

func imageGenerator(header []string) func(record []string) string {
	nameToIndexMap := createNameToIndexMap(header)

	return func(record []string) string {
		aveI := nameToIndexMap["AccelerationX Ave"]
		average, _ := strconv.Atoi(record[aveI])

		switch {
		case average < 10:
			return statusToFilename["stop"]
		case average < 30:
			return statusToFilename["green"]
		case average < 60:
			return statusToFilename["yellow"]
		default:
			return statusToFilename["red"]
		}
	}
}

func createNameToIndexMap(header []string) map[string]int64 {
	nameToIndex := make(map[string]int64)
	for i, name := range header {
		nameToIndex[name] = int64(i)
	}

	return nameToIndex
}
