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
	file, err := os.Open(targetDir + "risks.csv")
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
		results = append(results, float64(discretization(res)))
	}

	return results, err
}

func discretization(x float64) float64 {
	switch true {
	case x < 0.01:
		return 0
	case x < 0.5:
		return 4
	case x < 1.0:
		return 3
	case x < 1.4:
		return 2
	default:
		return 1
	}
}
