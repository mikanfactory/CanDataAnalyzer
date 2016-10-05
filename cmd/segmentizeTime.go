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

	wg := new(sync.WaitGroup)
	for _, target := range targets.Names {
		wg.Add(1)
		go func(target string) {
			segmentizeTime(target, cacheInfo)
			wg.Done()
		}(target)
	}

	wg.Wait()
}

func destroyAllData() {
	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	_, err = db.Exec("DELETE FROM cans")
	checkErr(err)
}

func segmentizeTime(target string, cacheInfo CacheInfo) {
	file, err := os.Open("data/" + target + ".csv")
	checkErr(err)

	r := csv.NewReader(bufio.NewReader(file))
	allRecords, err := r.ReadAll()
	checkErr(err)

	validColumns := getValidColumns(cacheInfo)
	allRecords = allRecords[headerLines:]

	for i := 0; i < len(allRecords)/segmentSize; i++ {
		records := allRecords[i*segmentSize : (i+1)*segmentSize]
		insertField(target, validColumns, calcAllAverage(validColumns, &records))
	}
}

func insertField(target string, validColumns []Column, field []float64) {
	mutex.Lock()
	defer mutex.Unlock()

	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	query := createQueryStr(target, validColumns, field)

	_, err = db.Exec(query)
	checkErr(err)
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

func calcAllAverage(columns []Column, records *[][]string) []float64 {
	result := []float64{}
	for _, column := range columns {
		result = append(result, calcColumAverage(column, records))
	}

	return result
}

func calcColumAverage(column Column, records *[][]string) float64 {
	var average float64
	values := []float64{}
	for _, record := range *records {
		value, _ := strconv.ParseFloat(record[column.Index], 64)
		values = append(values, value)
		average += value
	}

	return average / float64(len(*records))
}

func isIndexColumn(column Column) bool {
	return column.Name == "FrameIndex" || column.Name == "FrameImageIndex"
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
