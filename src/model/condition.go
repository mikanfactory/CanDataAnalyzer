package model

import "strconv"

func (c *Condition) evalRecord(record []string, nameToIndex map[string]int64) bool {
	aveI := nameToIndex[c.Feature]
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
