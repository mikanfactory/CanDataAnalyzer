package cmd

import (
	"bufio"
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"sync"

	_ "github.com/mattn/go-sqlite3"
)

const (
	headerLines = 2
	segmentSize = 100
)

var mutex = &sync.Mutex{}

func InsertData() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	if _, err := os.Stat(dbConfig); os.IsExist(err) {
		destroyAllData()
	}

	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	size := len(targets.Names)
	q := make(chan string, 1000)
	fin := make(chan string, size)
	validColumns := getValidColumns(cacheInfo)

	for _, target := range targets.Names {
		go segmentizeData(q, fin, target, validColumns)
	}

	finished := 0
	for {
		select {
		case query := <-q:
			insert(db, query)

		case <-fin:
			if finished < size-1 {
				finished++
				continue
			}

			return
		}
	}
}

func insert(db *sql.DB, query string) {
	mutex.Lock()
	defer mutex.Unlock()

	_, err := db.Exec(query)
	checkErr(err)
}

func segmentizeData(q, fin chan string, target string, validColumns []Column) {
	file, err := os.Open("data/input/" + target + ".csv")
	checkErr(err)

	r := csv.NewReader(bufio.NewReader(file))
	allRecords, err := r.ReadAll()
	checkErr(err)

	allRecords = allRecords[headerLines:]

	for i := 0; i < len(allRecords)/segmentSize; i++ {
		records := allRecords[i*segmentSize : (i+1)*segmentSize]
		averages := summurizeColumns(validColumns, &records)
		q <- createQueryStr(target, validColumns, averages)
	}

	fin <- ""
}

func summurizeColumns(columns []Column, records *[][]string) []float64 {
	result := []float64{}
	for _, column := range columns {
		result = append(result, summurizeColumn(column, records))
	}

	return result
}

func summurizeColumn(column Column, records *[][]string) float64 {
	if column.Name == "BrakeOnOff" || column.Name == "AcceleratorOnOff" {
		return calcMax(column, records)
	}

	return calcAverage(column, records)
}

func calcMax(column Column, records *[][]string) float64 {
	max := -100.0
	for _, record := range *records {
		value, _ := strconv.ParseFloat(record[column.Index], 64)
		if max < value {
			max = value
		}
	}

	return max
}

func calcAverage(column Column, records *[][]string) float64 {
	var average float64
	values := []float64{}
	for _, record := range *records {
		value, _ := strconv.ParseFloat(record[column.Index], 64)
		values = append(values, value)
		average += value
	}

	return average / float64(len(*records))
}

func createQueryStr(target string, validColumns []Column, field []float64) string {
	names := "target,"
	values := fmt.Sprintf(`"%s",`, target)
	for i, column := range validColumns {
		names += column.Name + ","

		if isIndexColumn(column) {
			values += strconv.FormatInt(int64(field[i]), 10) + ","
		} else {
			values += strconv.FormatFloat(field[i], 'G', -1, 64) + ","
		}
	}
	names = strings.TrimRight(names, ",")
	values = strings.TrimRight(values, ",")

	return fmt.Sprintf("INSERT INTO cans (%s) VALUES (%s);", names, values)
}

func isIndexColumn(column Column) bool {
	return column.Name == "FrameIndex" || column.Name == "FrameImageIndex"
}

func destroyAllData() {
	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	_, err = db.Exec("DELETE FROM cans")
	checkErr(err)
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

func readCacheConfig(c *CacheInfo) {
	file, err := ioutil.ReadFile("config/cacheConfig.json")
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(file, c)
	if err != nil {
		log.Fatal(err)
	}
}