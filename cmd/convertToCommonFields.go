package cmd

// ***DO NOT USE THIS SCRIPT***

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"os"
)

func ConvertToCommonFields() {
	file, err := ioutil.ReadFile("config/cacheConfig.json")
	checkErr(err)

	cacheInfo := &CacheInfo{}
	err = json.Unmarshal(file, cacheInfo)
	checkErr(err)

	f1, err := ioutil.ReadFile("config/targets.json")

	t1 := &Targets{}
	err = json.Unmarshal(f1, t1)
	checkErr(err)

	f2, err := ioutil.ReadFile("config/invalidTargets.json")
	checkErr(err)

	t2 := &Targets{}
	err = json.Unmarshal(f2, t2)
	checkErr(err)

	for _, name := range t2.Names {
		convertToCommonFields(name, *cacheInfo)
	}

	for _, name := range validTargets(t1.Names, t2.Names) {
		copyFile(name)
	}
}

func validTargets(ns1, ns2 []string) []string {
	set := map[string]int{}
	for _, name := range ns1 {
		set[name] = -1
	}

	for _, name := range ns2 {
		set[name] = 1
	}

	valids := []string{}
	for _, name := range ns1 {
		if set[name] != 1 {
			valids = append(valids, name)
		}
	}

	return valids
}

func convertToCommonFields(name string, info1 CacheInfo) {
	// Read Cache Config
	f1, err := ioutil.ReadFile("config/cacheConfigF.json")
	checkErr(err)

	info2 := &CacheInfo{}
	err = json.Unmarshal(f1, info2)
	checkErr(err)

	// Get Valid Columns
	validColumns := commonColumns(info1, *info2)

	// Read Original Data
	f2, err := os.Open("data/original/" + name + ".csv")
	checkErr(err)
	r := csv.NewReader(bufio.NewReader(f2))

	// Write Common Format Data
	f3, err := os.OpenFile("data/pre/"+name+".csv", os.O_WRONLY|os.O_CREATE, 0644)
	checkErr(err)
	w := csv.NewWriter(f3)

	header, _ := r.Read()
	w.Write(updateHeader(validColumns, header))
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("[Warning] %s\n", err.Error())
			continue
		}
		column := updateColumn(validColumns, record)
		w.Write(column)
		w.Flush()
	}

}

// info1: Valid CacheInfo
// info2: Target CacheInfo
func commonColumns(info1, info2 CacheInfo) []Column {
	// Initialize Set
	set := map[string]int{}
	for _, c2 := range info2.Columns {
		set[c2.Name] = -1
	}

	for _, c1 := range info1.Columns {
		if set[c1.Name] != 0 {
			set[c1.Name] = 1
		}
	}

	columns := []Column{}
	for _, c2 := range info2.Columns {
		if set[c2.Name] == 1 {
			columns = append(columns, c2)
		}
	}

	return columns
}

func updateColumn(validColumns []Column, record []string) []string {
	result := []string{}
	for _, c := range validColumns {
		result = append(result, record[c.Index])
	}

	return result
}

func updateHeader(validColumns []Column, record []string) []string {
	result := []string{}
	for _, c := range validColumns {
		result = append(result, c.Name)
	}

	return result
}

func copyFile(target string) {
	src, err := os.Open("data/original/" + target + ".csv")
	checkErr(err)
	defer src.Close()

	// Remove file if it exists
	dstPath := "data/pre/" + target + ".csv"
	if _, err := os.Stat(dstPath); os.IsExist(err) {
		os.Remove(dstPath)
	}

	dst, err := os.Create(dstPath)
	checkErr(err)
	defer dst.Close()

	_, err = io.Copy(dst, src)
	checkErr(err)
}
