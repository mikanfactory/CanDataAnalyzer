package model

import (
	"encoding/csv"
	"encoding/json"
	"io/ioutil"
	"os"
	"regexp"
	"strconv"
	"time"
)

func (m *Heatmap) SaveSetting() error {
	dirname := "data/output/" + m.createDirname()
	filename := dirname + "/setting.json"

	if _, err := os.Stat(dirname); os.IsNotExist(err) {
		if err := os.Mkdir(dirname, 0755); err != nil {
			return err
		}
	}

	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	json, _ := json.Marshal(m)
	if err := ioutil.WriteFile(filename, json, 0744); err != nil {
		return err
	}

	return nil
}

func (m *Heatmap) SaveData() error {
	dirname := "data/output/" + m.createDirname()
	filename := dirname + "/result.csv"

	file, err := os.Create(filename)
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
		str := []string{strconv.Itoa(i)}
		for _, val := range weight {
			str = append(str, strconv.Itoa(int(val)))
		}
		content = append(content, str)
	}

	return content
}

func (m *Heatmap) createDirname() string {
	t := time.Now()
	const layout = "2006-01-02_15:04:05"
	return t.Format(layout)
}

func readHeatmapConfig(targetDir string) (*Heatmap, error) {
	file, err := ioutil.ReadFile(targetDir + "setting.json")
	if err != nil {
		return &Heatmap{}, err
	}

	heatmap := &Heatmap{}
	err = json.Unmarshal(file, heatmap)
	if err != nil {
		return &Heatmap{}, err
	}

	return heatmap, nil
}
