package cmd

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
)

func CreateConfig() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	t1 := targets.Names[0]

	c1 := extractHeader(t1)
	j1, _ := json.Marshal(c1)
	ioutil.WriteFile("config/cacheConfig.json", j1, 0744)
}

func extractHeader(target string) CacheInfo {
	file, err := os.Open("data/original/" + target + ".csv")
	checkErr(err)
	defer file.Close()

	r := csv.NewReader(bufio.NewReader(file))
	header, err := r.Read()
	checkErr(err)

	convType := map[string]string{
		"Time":              "float64",
		"BRKSWTM":           "int64",
		"RawPedal_APOFS[%]": "int64",
	}

	convName := map[string]string{
		"VSO[km/h]":              "Speed",
		"LON_GPS[deg]":           "Longitude",
		"LAT_GPS[deg]":           "Latitude",
		"BRKSWTM":                "Brake",
		"RawPedal_APOFS[%]":      "Accel",
		"Z_ABST_toAT[m]":         "AheadDistance",
		"STRANGLE[deg]":          "SteeringAngle",
		"Curve_0[\ufffd\ufffdm]": "CurveRadius",
		"DistTollgate[m]":        "DistTollgate",
		"DistDivergence[m]":      "DistDivergence",
		"RoadType":               "RoadType",
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
