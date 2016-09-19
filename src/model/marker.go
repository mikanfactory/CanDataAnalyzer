package model

import (
	"bufio"
	"encoding/csv"
	"os"
	"strconv"
)

const headerLines = 2

type imageAnalyzer func(record []string) string
type descriptionAnalyzer func(record []string) string
type positionAnalyzer func(record []string) Position

var statusToFilename = map[string]string{
	"green":    "./static/icon/green_car.png",
	"yellow":   "./static/icon/yellow_car.png",
	"red":      "./static/icon/red_car.png",
	"up":       "./static/icon/up.png",
	"down":     "./static/icon/down.png",
	"right":    "./static/icon/right.png",
	"left":     "./static/icon/left.png",
	"straight": "./static/icon/straight.png",
	"stop":     "./static/icon/stop_car.png",
	"empty":    "./static/icon/empty.png",
	"normal":   "./static/icon/normal.png",
}

// LoadMarkers load markers from csv file specified by target argument.
func LoadMarkers(xs *[]Marker, setting Setting) error {
	records, err := readFile(setting.Target)
	if err != nil {
		return err
	}

	markers := []Marker{}
	getImage := genImageAnalyzer(records[0], setting.Conditions)
	getPosition := genPositonAnalyzer(records[0])
	getDescription := genDescriptionAnalyzer(records[0])
	for i, record := range records {
		if i < headerLines {
			continue
		}

		marker := Marker{
			ID:          int64(i),
			Image:       getImage(record),
			Position:    getPosition(record),
			Description: getDescription(record),
		}

		markers = append(markers, marker)
	}

	*xs = markers

	return nil
}

// TODO: Copy all file may expensive. So I have to use pointer.
// If I introduce levelDB, I can write this function compactly.
func readFile(target string) ([][]string, error) {
	file, err := os.Open("data/" + target + "-cache.csv")
	if err != nil {
		return [][]string{}, err
	}

	r := csv.NewReader(bufio.NewReader(file))
	r.LazyQuotes = true
	records, err := r.ReadAll()
	if err != nil {
		return [][]string{}, err
	}

	return records, nil
}

func genDescriptionAnalyzer(header []string) descriptionAnalyzer {
	names := header

	return func(record []string) string {
		description := ""
		for i, feature := range record {
			cmp := "<div class='feature'>" + names[i] + ": " + feature + "</div>"
			description = description + cmp + "\n"
		}

		return description
	}
}

func genPositonAnalyzer(header []string) positionAnalyzer {
	nameToIndex := createNameToIndex(header)

	return func(record []string) Position {
		latI := nameToIndex["GPSLatitude Ave"]
		lngI := nameToIndex["GPSLongtitude Ave"]
		lat, _ := strconv.ParseFloat(record[latI], 64)
		lng, _ := strconv.ParseFloat(record[lngI], 64)

		return Position{Latitude: lat, Longutitude: lng}
	}
}

func genImageAnalyzer(header []string, conditions []Condition) imageAnalyzer {
	nameToIndex := createNameToIndex(header)

	// if record matchs the condition then returns status icon,
	// else normal icon.
	return func(record []string) string {
		for _, cond := range conditions {
			if cond.evalRecord(record, nameToIndex) {
				return statusToFilename[cond.Status]
			}
		}

		return statusToFilename["normal"]
	}
}

func createNameToIndex(header []string) map[string]int64 {
	nameToIndex := make(map[string]int64)
	for i, name := range header {
		nameToIndex[name] = int64(i)
	}

	return nameToIndex
}
