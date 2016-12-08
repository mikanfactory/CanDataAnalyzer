package cmd

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"os"

	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

func ExtractSwitchingPoint() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	db, err := sql.Open("sqlite3", metaDBConfig)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	if _, err := os.Stat(dbConfig); os.IsExist(err) {
		destroyAllData()
	}

	validColumns := getValidColumns(cacheInfo)
	for _, target := range targets.Names {
		writeSwitchingPoint(db, target, validColumns)
	}
}

func writeSwitchingPoint(db *sql.DB, target string, validColumns []Column) {
	cs, _ := getSwitchingPoint(db, target)

	markers := []model.Marker{}
	for i := 0; i < len(cs)-1; i++ {
		prev, next := cs[i], cs[i+1]
		if prev.Accel == -1 {
			status := ""
			switch {
			case next.Brake == 2 && calcDiffSecond(prev, next) < 2:
				status = "RedB"
			case next.Brake == 2 && calcDiffSecond(prev, next) >= 2:
				status = "BlueB"
			case next.Accel == 2 && calcDiffSecond(prev, next) < 5:
				status = "RedA"
			case next.Accel == 2 && calcDiffSecond(prev, next) >= 5:
				status = "BlueB"
			}

			setting := model.Setting{ID: 10000}
			m1 := prev.ToMarker(model.Condition{Status: "caution"}, setting)
			m2 := next.ToMarker(model.Condition{Status: status}, setting)
			markers = append(markers, m1)
			markers = append(markers, m2)
		}
	}

	json, _ := json.Marshal(markers)
	ioutil.WriteFile("data/switch.json", json, 0744)
}

func getSwitchingPoint(db *sql.DB, target string) ([]model.Can, error) {
	query := "select * from cans"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return model.ScanCans(rows)
}

func calcDiffSecond(prev, next model.Can) float64 {
	return float64(prev.Time-next.Time) * 0.001
}
