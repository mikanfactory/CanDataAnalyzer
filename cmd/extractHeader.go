package cmd

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
)

func ExtractHeader() {
	t1 := "L53E-DM05_2119_20161102142424.csv"

	c1 := extractHeader(t1)
	j1, _ := json.Marshal(c1)
	ioutil.WriteFile("config/cacheConfig.json", j1, 0744)
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
		"VSO[km/h]":              "Speed",
		"LON_GPS[deg]":           "Longitude",
		"LAT_GPS[deg]":           "Latitude",
		"BRKSWTM[]":              "Brake",
		"RawPedal_APOFS[%]":      "Accel",
		"Z_ABST_toAT[m]":         "AheadDistance",
		"STRANGLE[deg]":          "SteeringAngle",
		"Curve_0[\ufffd\ufffdm]": "CurveRadius",
		"DistDivergence[m]":      "DistDivergence",
		"RoadType[]":             "RoadType",
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
