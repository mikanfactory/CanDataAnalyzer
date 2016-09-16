package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"log"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type CacheInfo struct {
	Target  string
	Columns []Column
}

type Column struct {
	Index        int64
	Name         string
	JapaneseName string `json:"jName"`
	Read         bool
}

type Line struct {
	FrameNumber      string
	MovieFrameNumber string
	Statistics       []Statistics
}

type Statistics struct {
	Name     string
	Average  float64
	Variance float64
}

const SegmentSize = 100

func main() {
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	segmentizeTime(cacheInfo)
}

func segmentizeTime(cacheInfo CacheInfo) {
	file, err := os.Open("../data/" + cacheInfo.Target)
	if err != nil {
		log.Fatal(err)
	}

	r := csv.NewReader(bufio.NewReader(file))
	allRecords, err := r.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	validColumns := getValidColumns(cacheInfo)

	result := []Line{}
	for i := 0; i < len(allRecords)/SegmentSize; i++ {
		records := allRecords[i*SegmentSize : (i+1)*SegmentSize]
		result = append(result, calcStatistics(validColumns, &records))
	}

	writeCSV(cacheInfo, result)
}

func writeCSV(cacheInfo CacheInfo, result []Line) {
	filename := cacheInfo.Target
	name := strings.TrimSuffix(filename, filepath.Ext(filename))
	target := "../data/" + name + "-cache" + filepath.Ext(filename)

	file, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE, 0600)
	if err != nil {
		log.Fatal(err)
	}

	w := csv.NewWriter(file)
	w.Write(createHeader(cacheInfo))
	for _, line := range result {
		field := []string{}
		field = append(field, line.FrameNumber, line.MovieFrameNumber)
		for _, st := range line.Statistics {
			average := strconv.FormatFloat(st.Average, 'G', -1, 64)
			variance := strconv.FormatFloat(st.Variance, 'G', -1, 64)
			field = append(field, average, variance)
		}
		w.Write(field)
	}
}

func readCacheConfig(c *CacheInfo) {
	file, err := ioutil.ReadFile("../config/cacheConfig.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(file, c)
	if err != nil {
		log.Fatal(err)
	}
}

func calcStatistics(columns []Column, records *[][]string) Line {
	result := []Statistics{}
	for _, column := range columns {
		result = append(result, calcStatistic(column, records))
	}

	line := getLines(*records, result)
	return line
}

func calcStatistic(column Column, records *[][]string) Statistics {
	var average float64
	var variance float64
	values := []float64{}
	for i, record := range *records {
		if i < 2 {
			continue
		}

		value, _ := strconv.ParseFloat(record[column.Index], 64)
		values = append(values, value)
		average += value
	}

	average = average / float64(SegmentSize)
	for _, v := range values {
		variance += math.Pow(v-average, 2)
	}

	return Statistics{
		Name:     column.Name,
		Average:  average,
		Variance: variance / float64(SegmentSize),
	}
}

func getLines(records [][]string, statistics []Statistics) Line {
	record := records[2]
	return Line{
		FrameNumber:      record[1],
		MovieFrameNumber: record[2],
		Statistics:       statistics,
	}
}

func getValidColumns(cacheInfo CacheInfo) []Column {
	valids := []Column{}
	for _, column := range cacheInfo.Columns {
		if column.Read {
			valids = append(valids, column)
		}
	}

	return valids
}

func createHeader(cacheInfo CacheInfo) []string {
	buffer := []string{}
	buffer = append(buffer, "FrameNumber", "MovieFrameNumber")
	for _, column := range cacheInfo.Columns {
		if column.Read {
			buffer = append(buffer, column.Name+" Ave", column.Name+" Var")
		}
	}

	return buffer
}
