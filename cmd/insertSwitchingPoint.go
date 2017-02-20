package cmd

import (
	"bufio"
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"math"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

func InsertSwitchingPoint() {
	// create table
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	CleanTable(MetaDBConfig)

	db, err := sql.Open("mysql", MetaDBConfig)
	checkErr(err)

	// insert data
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	validColumns := getValidColumns(cacheInfo)

	for _, target := range targets.Names {
		log.Printf("target is %s ...", target)
		insertSP(db, target, validColumns)
	}
}

func insertSP(db *sql.DB, target string, validColumns []Column) {
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
				value, err := strconv.ParseFloat(record[column.Index], 64)
				checkErr(err)

				if math.IsInf(value, 0) {
					value = 10000
				}

				result = append(result, value)
			}

			query := createQueryString(target, validColumns, result)
			insert(db, query)
		}

	}
}

func isSwitchingPoint(column string) bool {
	return column == "-1" || column == "2"
}
