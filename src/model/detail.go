package model

import (
	"fmt"
	"strconv"
)

func (c *Detail) evalRecord(record []string, nameToIndex map[string]int64) bool {
	featureName := fmt.Sprintf("%s Ave", c.Feature)
	aveI := nameToIndex[featureName]
	average, _ := strconv.ParseFloat(record[aveI], 64)

	switch {
	case c.Operator == "<":
		return average < c.Value
	case c.Operator == "<=":
		return average <= c.Value
	case c.Operator == "==":
		return average == c.Value
	case c.Operator == ">":
		return average > c.Value
	case c.Operator == ">=":
		return average >= c.Value
	default:
		return false
	}
}
