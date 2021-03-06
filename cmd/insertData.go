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

	_ "github.com/go-sql-driver/mysql"
	"github.com/mikanfactory/CanDataAnalyzer/src/config"
)

const (
	headerLines = 1
)

var mutex = &sync.Mutex{}
var segmentSize = 30

func InsertData() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	CleanTable("summary")

	conf := config.LoadConfig()
	db, err := sql.Open("mysql", conf.DB.MysqlConf("summary"))
	checkErr(err)

	segmentSize = conf.Command.SegmentSize
	log.Printf("segment size: %d", segmentSize)

	validColumns := getValidColumns(cacheInfo)

	for _, target := range targets.Names {
		log.Printf("target is %s ...", target)
		segmentizeData(db, target, validColumns)
	}
}

func insert(db *sql.DB, query string) {
	_, err := db.Exec(query)
	checkErr(err)
}

func segmentizeData(db *sql.DB, target string, validColumns []Column) {
	file, err := os.Open("data/input/" + target + ".csv")
	checkErr(err)

	r := csv.NewReader(bufio.NewReader(file))
	allRecords, err := r.ReadAll()
	checkErr(err)

	allRecords = allRecords[headerLines:]

	for i := 0; i < len(allRecords)/segmentSize; i++ {
		records := allRecords[i*segmentSize : (i+1)*segmentSize]
		averages := summarizeColumns(validColumns, &records)
		query := createQueryString(target, validColumns, averages)
		insert(db, query)
	}
}

func summarizeColumns(columns []Column, records *[][]string) []float64 {
	result := []float64{}
	for _, column := range columns {
		result = append(result, summarizeColumn(column, records))
	}

	return result
}

func summarizeColumn(column Column, records *[][]string) float64 {
	if isIntegerColumn(column) {
		switch {
		case column.Summary == "max":
			return calcMax(column, records)
		case column.Summary == "min":
			return calcMin(column, records)
		case column.Summary == "max||min":
			return calcMaxOrMin(column, records)
		default:
			return calcAverage(column, records)
		}
	}

	return calcAverage(column, records)
}

func calcMaxOrMin(column Column, records *[][]string) float64 {
	max, min := -100, 100
	for _, record := range *records {
		value, _ := strconv.ParseInt(record[column.Index], 10, 0)
		intv := int(value)
		if min > intv {
			min = intv
		}

		if max < intv {
			max = intv
		}
	}

	if min == -1 {
		return float64(min)
	}

	return float64(max)
}

func calcMax(column Column, records *[][]string) float64 {
	max := -100
	for _, record := range *records {
		value, _ := strconv.ParseInt(record[column.Index], 10, 0)
		intv := int(value)
		if max < intv {
			max = intv
		}
	}

	return float64(max)
}

func calcMin(column Column, records *[][]string) float64 {
	min := 100
	for _, record := range *records {
		value, _ := strconv.ParseInt(record[column.Index], 10, 0)
		intv := int(value)
		if min > intv {
			min = intv
		}
	}

	return float64(min)
}

func calcAverage(column Column, records *[][]string) float64 {
	var average float64
	counter := 0
	values := []float64{}
	for _, record := range *records {
		value, _ := strconv.ParseFloat(record[column.Index], 64)
		values = append(values, value)
		average += value
		counter++
	}

	return average / float64(counter)
}

func createQueryString(target string, validColumns []Column, field []float64) string {
	names := "target,"
	values := fmt.Sprintf(`"%s",`, target)
	for i, column := range validColumns {
		names += column.Name + ","

		if isIntegerColumn(column) {
			values += strconv.FormatInt(int64(field[i]), 10) + ","
		} else {
			values += strconv.FormatFloat(field[i], 'G', -1, 64) + ","
		}
	}
	names = strings.TrimRight(names, ",")
	values = strings.TrimRight(values, ",")

	return fmt.Sprintf("INSERT INTO cans (%s) VALUES (%s);", names, values)
}

func isIntegerColumn(column Column) bool {
	return column.Type == "int64"
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
