package model

func (c *Condition) evalRecord(record []string, nameToIndex map[string]int64) bool {
	// Single condition
	if len(c.Exprs) == 1 {
		return c.Exprs[0].evalRecord(record, nameToIndex)
	}

	// Double or more conditions
	acc := false
	for i, expr := range c.Exprs {
		switch {
		case i == 0:
			acc = expr.evalRecord(record, nameToIndex)
		case c.LOPs[i-1] == "&&":
			acc = acc && expr.evalRecord(record, nameToIndex)
		case c.LOPs[i-1] == "||":
			acc = acc || expr.evalRecord(record, nameToIndex)
		}
	}

	return acc
}
