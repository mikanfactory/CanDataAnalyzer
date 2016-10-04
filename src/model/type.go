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

// Error is used for json error message
type Error struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// Grid stand for grid used for creating heatmap
type Grid struct {
	Width     float64  `json:"width"`
	Height    float64  `json:"height"`
	MeshSize  int64    `json:"meshSize"`
	NorthEast Position `json:"northEast"`
}

// Heatmap is config of heatmap data
type Heatmap struct {
	Grid     Grid      `json:"grid"`
	Statuses []string  `json:"statuses"`
	Weights  [][]int64 `json:"weight"`
	Settings []Setting `json:"settings"`
}
