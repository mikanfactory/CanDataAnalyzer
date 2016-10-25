package model

import (
	"bufio"
	"encoding/csv"
	"io"
	"os"
	"strconv"
)

func ReadClusterConfig(targetDir string) (Cluster, error) {
	heatmap, err := readHeatmapConfig(targetDir)
	if err != nil {
		return Cluster{}, err
	}

	results, err := readClusterResults(targetDir)
	if err != nil {
		return Cluster{}, err
	}

	return Cluster{Grid: heatmap.Grid, Content: results}, nil
}

func readClusterResults(targetDir string) ([]int64, error) {
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
