package model

// Cache contains the columns specified by config/cacheConfig.json
type Cache struct {
	Columns []string
}

// Markers have Name which is the amount of feature of interest like `Speed`.
type Markers struct {
	Name    string   `json:"name"`
	Markers []Marker `json:"markers"`
}

// Marker is used for GoogleMap Marker.
type Marker struct {
	ID         int64    `json:"id"`
	Image      string   `json:"image"`
	Position   Position `json:"position"`
	Components []string `json:"components"`
}

// Position means position of the marker.
type Position struct {
	Latitude    float64 `json:"lat"`
	Longutitude float64 `json:"lng"`
}
