package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"log"
	"os"
	"strconv"
)

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

type Cache struct {
	Columns []string
}

type Markers struct {
	Name    string   `json:"name"`
	Markers []Marker `json:"markers"`
}

type Marker struct {
	ID         int64    `json:"id"`
	Image      string   `json:"image"`
	Position   Position `json:"position"`
	Components []string `json:"components"`
}

type Position struct {
	Latitude    float64 `json:"lat"`
	Longutitude float64 `json:"lng"`
}

func main() {
	file, err := os.Open("../data/" + target)
	if err != nil {
		log.Fatal(err)
	}

	r := csv.NewReader(bufio.NewReader(file))
	r.LazyQuotes = true
	records, err := r.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	markers := []Marker{}
	getImage := imageGenerator(records[0])
	getPosition := positionGenerator(records[0])
	getComponents := componentsGenerator(records[0])
	for i, record := range records {
		if i < headerLines {
			continue
		}

		marker := Marker{
			ID:         int64(i),
			Image:      getImage(record),
			Position:   getPosition(record),
			Components: getComponents(record),
		}

		markers = append(markers, marker)
	}

	markersJSON, _ := json.Marshal(Markers{Name: "Speed", Markers: markers})
	os.Stdout.Write(markersJSON)
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

func positionGenerator(header []string) func(record []string) Position {
	nameToIndexMap := createNameToIndexMap(header)

	return func(record []string) Position {
		latI := nameToIndexMap["GPSLatitude Ave"]
		lngI := nameToIndexMap["GPSLongtitude Ave"]
		lat, _ := strconv.ParseFloat(record[latI], 64)
		lng, _ := strconv.ParseFloat(record[lngI], 64)

		return Position{Latitude: lat, Longutitude: lng}
	}
}

func imageGenerator(header []string) func(record []string) string {
	nameToIndexMap := createNameToIndexMap(header)

	return func(record []string) string {
		accelI := nameToIndexMap["AcceleratorOnOff Ave"]
		brakeI := nameToIndexMap["BrakeOnOff Ave"]
		accel, _ := strconv.Atoi(record[accelI])
		brake, _ := strconv.Atoi(record[brakeI])

		switch {
		case accel > 5:
			return statusToFilename["up"]
		case brake > 5:
			return statusToFilename["down"]
		default:
			return statusToFilename["empty"]
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