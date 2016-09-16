package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
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
	Index int
	Value []string
}

const SegmentSize = 100

func main() {
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	segmentizeTime(cacheInfo)
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

	result := [][]float64{}
	for i := 0; i < len(allRecords)/SegmentSize; i++ {
		records := allRecords[i*SegmentSize : (i+1)*SegmentSize]
		result = append(result, calcAverages(validColumns, &records))
	}

	fmt.Println(result)
}

func calcAverages(columns []Column, records *[][]string) []float64 {
	ch := make(chan float64, SegmentSize)
	for _, column := range columns {
		go calcAverage(column, records, ch)
	}

	result := []float64{}
	for _ = range ch {
		result = append(result, <-ch)
	}

	return result
}

func calcAverage(column Column, records *[][]string, ch chan float64) {
	var acc float64
	for i, record := range *records {
		if i < 3 {
			continue
		}

		tmp, _ := strconv.ParseFloat(record[column.Index], 64)
		acc += tmp
	}

	ch <- acc / float64(SegmentSize)
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
