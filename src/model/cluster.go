package model

import (
	"bufio"
	"encoding/csv"
	"io"
	"os"
	"strconv"

	"github.com/mikanfactory/CanDataAnalyzer/src/config"
)

var clusterFuncs = map[string]func(string) ([]int64, error){
	"tasks": readTaskResults,
	"risks": readRiskResults,
}

func ReadClusterConfig(target, targetDir string) (Cluster, error) {
	heatmap, err := readHeatmapConfig(targetDir)
	if err != nil {
		return Cluster{}, err
	}

	results, err := clusterFuncs[target](targetDir)
	if err != nil {
		return Cluster{}, err
	}

	return Cluster{Grid: heatmap.Grid, Content: results}, nil
}

func readTaskResults(targetDir string) ([]int64, error) {
	file, err := os.Open(targetDir + "clusters.csv")
	if err != nil {
		return []int64{}, err
	}

	results := []int64{}
	r := csv.NewReader(bufio.NewReader(file))
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return []int64{}, err
		}

		res, err := strconv.ParseInt(record[0], 10, 0)
		if err != nil {
			return []int64{}, err
		}
		results = append(results, int64(res))
	}

	return results, err
}

func readRiskResults(targetDir string) ([]int64, error) {
	file, err := os.Open(targetDir + "risks.csv")
	if err != nil {
		return []int64{}, err
	}

	conf := config.LoadConfig()
	desc := conf.App.ColorMax / float64(5)

	results := []int64{}
	r := csv.NewReader(bufio.NewReader(file))
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return []int64{}, err
		}

		res, err := strconv.ParseFloat(record[0], 0)
		if err != nil {
			return []int64{}, err
		}
		results = append(results, discretization(res, desc))
	}

	return results, err
}

func discretization(x float64, desc float64) int64 {
	switch true {
	case x < 0.0001:
		return 0
	case x < desc:
		return 5
	case x < desc*2:
		return 4
	case x < desc*3:
		return 3
	case x < desc*4:
		return 2
	default:
		return 1
	}
}
