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
		"TACHO[Tr/min]":          "Engine",
		"Z_ABST_toAT[m]":         "AheadDistance",
		"Curve_0[\u0403\u0433m]": "CurveRadius",
		"STRANGLE[deg]":          "SteeringAngle",
		"D_BRANCH_FLG":           "BranchFlag",
		"DistTollgate[m]":        "DistTollgate",
		"RoadType":               "RoadType",
		"VC_GreenLamp":           "GreenLamp",
		"VC_RedLamp":             "RedLamp",
		"VC_RightLamp":           "RightLamp",
		"VC_UpLamp":              "UpLamp",
		"VC_LeftLamp":            "LeftLamp",
		"VC_StopSign":            "StopSign",
		"VC_30Sign":              "Limit30Sign",
		"VC_50Sign":              "Limit50Sign",
		"VC_CarBrake":            "BrakeCar",
		"VC_LeftCar":             "LeftCar",
		"VC_ManCycleCount":       "ManBicycleCount",
		"VC_ManCycle":            "ManBicycle",
		"VC_ManCycleDistance[m]": "DistManBicycle",
		"VC_Pitch":               "Pitch",
		"VC_Signal[m]":           "DistSignal",
		"VC_NaviCls":             "PathType",
		"VC_LaneCount":           "LaneCount",
		"a":                      "AccelerationSpeed",
		"Jerk":                   "Jerk",
		"THW":                    "TimeHeadway",
		"TTC":                    "TimeToCollision",
		"RF":                     "RiskFactor",
	}

	LCcounter := 0
	columns := []Column{}
	for i, name := range header {
		t, n, r := "float64", name, false

		if convType[name] != "" {
			t, r = convType[name], true
		}

		if convName[name] != "" {
			n, r = convName[name], true
		}

		if convName[name] == "LaneCount" {
			if LCcounter == 0 {
				LCcounter++
				continue
			}
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
