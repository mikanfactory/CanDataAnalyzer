package model

import (
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
	"regexp"
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

	// write header
	header := m.createHeader()
	if err := w.Write(header); err != nil {
		return err
	}

	// write content
	content := m.createContent()
	if err := w.WriteAll(content); err != nil {
		return err
	}

	return nil
}

func (m *Heatmap) createHeader() []string {
	s := regexp.MustCompile(`\.\/static\/icon\/`)
	p := regexp.MustCompile(`\.png`)

	header := append([]string{"id"})
	for _, status := range m.Statuses {
		str := s.ReplaceAllString(status, "")
		str = p.ReplaceAllString(str, "")
		header = append(header, str)
	}

	return header
}

func (m *Heatmap) createContent() [][]string {
	content := [][]string{}
	for i, weight := range m.Weights {
		str := []string{strconv.Itoa(i + 1)}
		for _, val := range weight {
			str = append(str, strconv.Itoa(int(val)))
		}
		content = append(content, str)
	}

	return content
}
