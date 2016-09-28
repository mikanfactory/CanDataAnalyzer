package model

func (c *Condition) evalRecord(record []string, nameToIndex map[string]int64) bool {
	// Single condition
	if len(c.Details) == 1 {
		return c.Details[0].evalRecord(record, nameToIndex)
	}

	// Double or more conditions
	acc := false
	for i, detail := range c.Details {
		switch {
		case i == 0:
			acc = detail.evalRecord(record, nameToIndex)
		case c.Logics[i-1] == "and":
			acc = acc && detail.evalRecord(record, nameToIndex)
		case c.Logics[i-1] == "or":
			acc = acc || detail.evalRecord(record, nameToIndex)
		}
	}

	return acc
}
