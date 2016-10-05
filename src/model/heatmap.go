package model

import (
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
	"strconv"
)

func (m *Heatmap) SaveSetting() error {
	if _, err := os.Stat("data/output/a1"); os.IsExist(err) {
		if err := os.Mkdir("data/output/a1", 0755); err != nil {
			return err
		}
	}

	file, err := os.Create("data/output/a1/setting.json")
	if err != nil {
		return err
	}
	defer file.Close()

	json, _ := json.Marshal(m)
	if err := ioutil.WriteFile("data/output/a1/setting.json", json, 0744); err != nil {
		return err
	}

	return nil
}

func (m *Heatmap) SaveData() error {
	file, err := os.Create("data/output/a1/result.csv")
	if err != nil {
		return err
	}
	defer file.Close()

	w := csv.NewWriter(file)

	for _, weight := range m.Weights {
		str := []string{}
		for _, val := range weight {
			str = append(str, strconv.Itoa(int(val)))
		}
		if err := w.Write(str); err != nil {
			return err
		}
	}

	defer w.Flush()

	return nil
}
