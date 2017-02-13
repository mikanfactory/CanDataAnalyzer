package cmd

type CacheInfo struct {
	Columns []Column `json:"columns"`
}

type Column struct {
	Index int64
	Type  string
	Name  string
	Read  bool
}

type Targets struct {
	Names []string `json:"names"`
}

type SwitchingPoint struct {
	Index       int
	ColumnIndex int64
	Value       string
}

func toCSV(columns []Column) []string {
	acc := []string{}
	for _, v := range columns {
		acc = append(acc, v.Name)
	}
	acc = append(acc, "flag")
	return acc
}
