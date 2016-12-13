package cmd

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
)

func ExtractHeader() {
	// t1 := "Data01_2119_20161007142516.csv"
	t2 := "L53E-DM05_2119_20161102142424.csv"

	cacheInfo := extractHeader(t2)
	json, _ := json.Marshal(cacheInfo)
	ioutil.WriteFile("config/cacheConfigX.json", json, 0744)
}

func extractHeader(target string) CacheInfo {
	file, err := os.Open("data/original/" + target)
	checkErr(err)
	defer file.Close()

	r := csv.NewReader(bufio.NewReader(file))
	header, err := r.Read()
	checkErr(err)

	convType := map[string]string{
		"Time":              "int64",
		"BRKSWTM[]":         "int64",
		"RawPedal_APOFS[%]": "int64",
	}

	convName := map[string]string{
		"VSO[km/h]":         "Speed",
		"LON_GPS[deg]":      "Longitude",
		"LAT_GPS[deg]":      "Latitude",
		"BRKSWTM[]":         "Brake",
		"RawPedal_APOFS[%]": "Accel",
		"Z_ABST_toAT[m]":    "AheadDistance",
		"STRANGLE[deg]":     "SteeringAngle",
	}

	columns := []Column{}
	for i, name := range header {
		t, n, r := "float64", name, false

		if convType[name] != "" {
			t, r = convType[name], true
		}

		if convName[name] != "" {
			n, r = convName[name], true
		}

		column := Column{
			Index: int64(i),
			Type:  t,
			Name:  n,
			Read:  r,
		}

		columns = append(columns, column)
	}

	return CacheInfo{Columns: columns}
}
