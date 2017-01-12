package cmd

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func ConvertSwitchingPointToCSV() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	db, err := sql.Open("sqlite3", metaDBConfig)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	validColumns := getValidColumns(cacheInfo)

	for _, target := range targets.Names {
		out, err := os.OpenFile("data/middle/"+target+".csv", os.O_WRONLY|os.O_CREATE, 0644)
		checkErr(err)
		w := csv.NewWriter(out)

		ms := outputSwitchingPoint(db, target, validColumns)
		w.WriteAll(ms)
		w.Flush()
	}
}

func outputSwitchingPoint(db *sql.DB, target string, validColumns []Column) [][]string {
	cs, err := getSwitchingPoint(db, target)
	checkErr(err)

	markers := [][]string{}
	for i := 0; i < len(cs)-1; i++ {
		prev, next := cs[i], cs[i+1]
		if prev.Accel == -1 {
			status := getStatus(prev, next)

			marker := prev.ToCSV(status)
			markers = append(markers, marker)
		}
	}

	return markers
}
