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

type Line struct {
	FrameNumber      string
	MovieFrameNumber string
	Statistics       []Statistics
}

type Statistics struct {
	Name     string
	Average  float64
	Variance float64
}
