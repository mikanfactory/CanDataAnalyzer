package cmd

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

func ConvSwitchingPointToJSON() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	db, err := sql.Open("sqlite3", metaDBConfig)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	if _, err := os.Stat(DBConfig); os.IsExist(err) {
		destroyAllData()
	}

	validColumns := getValidColumns(cacheInfo)

	markers := []model.Marker{}
	for _, target := range targets.Names {
		ms := writeSwitchingPoint(db, target, validColumns)
		markers = append(markers, ms...)
	}

	json, _ := json.Marshal(markers)
	ioutil.WriteFile("data/middle/switch.json", json, 0744)
}

func writeSwitchingPoint(db *sql.DB, target string, validColumns []Column) []model.Marker {
	cs, _ := getSwitchingPoint(db, target)

	markers := []model.Marker{}
	for i := 0; i < len(cs)-1; i++ {
		prev, next := cs[i], cs[i+1]
		if prev.Accel == -1 {
			status := getStatus(prev, next)

			setting := model.Setting{ID: 10000}
			m1 := prev.ToMarker(model.Condition{Status: "caution"}, setting)
			m2 := next.ToMarker(model.Condition{Status: status}, setting)
			markers = append(markers, m1)
			markers = append(markers, m2)
		}
	}

	return markers
}

func getStatus(prev, next model.Can) string {
	switch {
	case next.Brake == 2 && calcDiffSecond(prev, next) < 2:
		return "RedB"
	case next.Brake == 2 && calcDiffSecond(prev, next) >= 2:
		return "BlueB"
	case next.Accel == 2 && calcDiffSecond(prev, next) < 5:
		return "RedA"
	case next.Accel == 2 && calcDiffSecond(prev, next) >= 5:
		return "BlueB"
	default:
		return "none"
	}
}

func getSwitchingPoint(db *sql.DB, target string) ([]model.Can, error) {
	query := fmt.Sprintf("select * from cans where target = '%s'", target)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return model.ScanCans(rows)
}

func calcDiffSecond(prev, next model.Can) float64 {
	return float64(next.Time-prev.Time) * 0.001
}
