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

	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	if _, err := os.Stat(dbConfig); os.IsExist(err) {
		destroyAllData()
	}

	validColumns := getValidColumns(cacheInfo)
	for _, target := range targets.Names {
		writeSwitchingPointData(db, target, validColumns)
	}
}

func writeSwitchingPoint(db *sql.DB, target string, validColumns []Column) {
	cs, _ := getSwitchPoint(db, target)
	pairs := twoPairs(cs)

	markers := []model.Marker{}
	for _, p := range pairs {
		if p[0].Accel == -1 {
			status := ""
			switch {
			case p[1].Brake == 2 && calcDiffSecond(p) < 2:
				status = "BrakeOn"
			case p[1].Brake == 2 && calcDiffSecond(p) >= 2:
				status = "BrakeOff"
			case p[1].Accel == 2 && calcDiffSecond(p) < 5:
				status = "AccelOn"
			case p[1].Accel == 2 && calcDiffSecond(p) >= 5:
				status = "AccelOff"
			}

			setting := model.Setting{ID: 10000}
			cond := model.Condition{Status: status}
			marker := p[0].ToMarker(cond, setting)
			markers = append(markers, marker)
		}
	}

	json, _ := json.Marshal(markers)
	ioutil.WriteFile("data/switch.json", json, 0744)
}

func getSwitchPoint(db *sql.DB, target string) ([]model.Can, error) {
	query := fmt.Sprintf("select * from cans where target = '%s' and (Brake == 2 or Brake == -1 or Accel == 2 or Accel == -1)", target)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return model.ScanCans(rows)
}

func calcDiffSecond(pair []model.Can) float64 {
	return float64(pair[1].Time-pair[0].Time) * 0.001
}

func twoPairs(cs []model.Can) [][]model.Can {
	acc := [][]model.Can{}
	for i := 0; i < len(cs)-1; i++ {
		acc = append(acc, cs[i:i+2])
	}

	return acc
}
