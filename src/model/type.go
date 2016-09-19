package model

// Cache contains the columns specified by config/cacheConfig.json
type Cache struct {
	Columns []string
}

// Marker is used for GoogleMap Marker.
type Marker struct {
	ID          int64    `json:"id"`
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
	Target     string      `json:"target"`
	Title      string      `json:"title"`
	Conditions []Condition `json:"conditions"`
}

// Condition denotes how to deal the status.
type Condition struct {
	Feature  string  `json:"feature"`
	Operator string  `json:"operator"`
	Value    float64 `json:"value"`
	Status   string  `json:"status"`
}
