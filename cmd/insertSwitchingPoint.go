package cmd

import (
	"bufio"
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

const metaDBConfig = "db/sp.db"

func InsertSwitchingPoint() {
	// create table
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	err := os.Remove(metaDBConfig)
	checkErr(err)

	db, err := sql.Open("sqlite3", metaDBConfig)
	checkErr(err)

	q1 := createTableStr(cacheInfo)
	_, err = db.Exec(q1)
	checkErr(err)

	q2 := "create index targetIndex on cans(target)"
	_, err = db.Exec(q2)
	checkErr(err)

	// insert data
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	size := len(targets.Names)
	q := make(chan string, 1000)
	fin := make(chan string, size)
	validColumns := getValidColumns(cacheInfo)

	for _, target := range targets.Names {
		go createSPQueryString(q, fin, target, validColumns)
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

func createSPQueryString(q, fin chan string, target string, validColumns []Column) {
	file, err := os.Open("data/input/" + target + ".csv")
	checkErr(err)

	brakeIndex := getColumnIndexByName(validColumns, "Brake")
	accelIndex := getColumnIndexByName(validColumns, "Accel")

	r := csv.NewReader(bufio.NewReader(file))
	r.Read() // remove header
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("[Warning] %s\n", err.Error())
			continue
		}

		// create query if row is switching point
		if isSwitchingPoint(record[brakeIndex]) || isSwitchingPoint(record[accelIndex]) {
			result := []float64{}
			for _, column := range validColumns {
				value, _ := strconv.ParseFloat(record[column.Index], 64)
				result = append(result, value)
			}

			q <- createQueryString(target, validColumns, result)
		}

	}

	fin <- ""
}

func isSwitchingPoint(column string) bool {
	if column == "-1" || column == "2" {
		return true
	}

	return false
}
