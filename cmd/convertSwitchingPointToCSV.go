package cmd

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func ConvertSwitchingPointToCSV() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	db, err := sql.Open("mysql", MetaDBConfig)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)
	validColumns := getValidColumns(cacheInfo)

	out, err := os.OpenFile("data/middle/sp.csv", os.O_WRONLY|os.O_CREATE, 0644)
	w := csv.NewWriter(out)

	err = w.Write(toCSV(validColumns))
	checkErr(err)

	for _, target := range targets.Names {
		checkErr(err)

		ms := outputSwitchingPoint(db, target, validColumns)
		for _, v := range ms {
			err := w.Write(v)
			checkErr(err)
		}
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
