package cmd

import (
	"database/sql"
	"encoding/json"
	"fmt"
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
				status = "BrakeOn"
			case next.Brake == 2 && calcDiffSecond(prev, next) >= 2:
				status = "BrakeOff"
			case next.Accel == 2 && calcDiffSecond(prev, next) < 5:
				status = "AccelOn"
			case next.Accel == 2 && calcDiffSecond(prev, next) >= 5:
				status = "AccelOff"
			}

			setting := model.Setting{ID: 10000}
			cond := model.Condition{Status: status}
			marker := prev.ToMarker(cond, setting)
			markers = append(markers, marker)
		}
	}

	json, _ := json.Marshal(markers)
	ioutil.WriteFile("data/switch.json", json, 0744)
}

func getSwitchingPoint(db *sql.DB, target string) ([]model.Can, error) {
	query := fmt.Sprintf("select * from cans where target = '%s' and (Brake == 2 or Brake == -1 or Accel == 2 or Accel == -1)", target)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return model.ScanCans(rows)
}

func calcDiffSecond(prev, next model.Can) float64 {
	return float64(prev.Time-next.Time) * 0.001
}
