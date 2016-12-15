package cmd

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

func DetectSwitchingPoint() {
	file, err := ioutil.ReadFile("config/targets.json")
	checkErr(err)

	targets := &Targets{}
	err = json.Unmarshal(file, targets)
	checkErr(err)

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	var wg sync.WaitGroup

	validColumns := getValidColumns(cacheInfo)
	for _, targets := range targets.Names {
		wg.Add(1)
		go func() {
			defer wg.Done()
			detectSwitchingPoint(targets, validColumns)
		}()
	}
	wg.Wait()
}

func detectSwitchingPoint(target string, columns []Column) {
	file, err := os.Open("data/pre/" + target + ".csv")
	defer file.Close()
	checkErr(err)

	r := csv.NewReader(bufio.NewReader(file))
	allRecords, err := r.ReadAll()
	checkErr(err)

	out, err := os.OpenFile("data/input/"+target+".csv", os.O_WRONLY|os.O_CREATE, 0644)
	checkErr(err)
	w := csv.NewWriter(out)

	brakeIndex := getColumnIndexByName(columns, "Brake")
	accelIndex := getColumnIndexByName(columns, "Accel")

	header := allRecords[0]
	w.Write(header)
	w.Flush()

	allRecords = allRecords[headerLines:]
	updateList := []SwitchingPoint{}
	for i := 0; i < len(allRecords)-1; i++ {
		prev, next := allRecords[i], allRecords[i+1]
		if res, p := shouldUpdateBrake(prev, next, i, brakeIndex); res {
			updateList = append(updateList, p)
		}
		if res, p := shouldUpdateAccel(prev, next, i, accelIndex); res {
			updateList = append(updateList, p)
		}
	}

	for _, v := range updateList {
		allRecords[v.Index][v.ColumnIndex] = v.Value
	}

	w.WriteAll(allRecords)
	w.Flush()
}

func shouldUpdateBrake(prev []string, next []string, ri int, ci int64) (bool, SwitchingPoint) {
	switch {
	case prev[ci] == next[ci]:
		return false, SwitchingPoint{}
	case prev[ci] == "0":
		return true, SwitchingPoint{ri, "Brake", ci, "2"}
	case next[ci] == "0":
		return true, SwitchingPoint{ri, "Brake", ci, "-1"}
	default:
		return false, SwitchingPoint{}
	}
}

func shouldUpdateAccel(prev []string, next []string, ri int, ci int64) (bool, SwitchingPoint) {
	switch {
	case prev[ci] == next[ci]: // Both prev and next are 0 or same positive value
		// Convert positive values to 1
		if prev[ci] != "0" {
			return true, SwitchingPoint{ri, "Brake", ci, "1"}
		}
		return false, SwitchingPoint{}
	case prev[ci] == "0":
		return true, SwitchingPoint{ri, "Brake", ci, "2"}
	case next[ci] == "0":
		return true, SwitchingPoint{ri, "Brake", ci, "-1"}
	default: // Both prev and next are over 0 but not equal
		return true, SwitchingPoint{ri, "Brake", ci, "1"}
	}
}

func getColumnIndexByName(columns []Column, name string) int64 {
	for _, column := range columns {
		if column.Name == name {
			return column.Index
		}
	}

	return 0
}
