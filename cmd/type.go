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
	Name        string
	ColumnIndex int64
	Value       string
}
