package model

import (
	"bufio"
	"encoding/csv"
	"io"
	"os"
	"strconv"
)

func ReadRiskConfig(targetDir string) (Risk, error) {
	heatmap, err := readHeatmapConfig(targetDir)
	if err != nil {
		return Risk{}, err
	}

	results, err := readRiskResults(targetDir)
	if err != nil {
		return Risk{}, err
	}

	return Risk{Grid: heatmap.Grid, Content: results}, nil
}

func readRiskResults(targetDir string) ([]float64, error) {
	file, err := os.Open(targetDir + "clusters8.csv")
	if err != nil {
		return []float64{}, err
	}

	results := []float64{}
	r := csv.NewReader(bufio.NewReader(file))
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return []float64{}, err
		}

		res, err := strconv.ParseFloat(record[0], 0)
		if err != nil {
			return []float64{}, err
		}
		results = append(results, float64(res))
	}

	return results, err
}
