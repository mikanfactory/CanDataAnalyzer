package model

// Cache contains the columns specified by config/cacheConfig.json
type Cache struct {
	Columns []string
}

// Marker is used for GoogleMap Marker.
type Marker struct {
	ID          int64    `json:"id"`
	SettingID   int64    `json:"settingID"`
	Image       string   `json:"image"`
	Position    Position `json:"position"`
	Description string   `json:"description"`
}

// Position means position of the marker.
type Position struct {
	Latitude    float64 `json:"lat"`
	Longutitude float64 `json:"lng"`
}

// Setting denotes the setting of the list of marker.
type Setting struct {
	ID         int64       `json:"id"`
	Target     string      `json:"target"`
	Title      string      `json:"title"`
	Conditions []Condition `json:"conditions"`
}

// Condition denotes how to deal the status.
type Condition struct {
	ID      int64  `json:"id"`
	Content string `json:"content"`
	Status  string `json:"status"`
}

// Message is used for sever responce
type Message struct {
	Code    int    `json:"code"`
	Content string `json:"content"`
}

// Grid stand for grid used for creating heatmap
type Grid struct {
	DivideSize int64    `json:"divideSize"`
	NorthEast  Position `json:"northEast"`
	SouthWest  Position `json:"southWest"`
}

// Heatmap is config of heatmap data
type Heatmap struct {
	Grid     Grid      `json:"grid"`
	Statuses []string  `json:"statuses"`
	Weights  [][]int64 `json:"weights"`
	Settings []Setting `json:"settings"`
}
