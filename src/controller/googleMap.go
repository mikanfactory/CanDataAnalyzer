package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

// GoogleMap control request of GoogleMap
type GoogleMap struct {
	Key string
}

// Get returns the template file with GoogleMapAPI key
func (m *GoogleMap) Get(c echo.Context) error {
	return c.Render(http.StatusOK, "index", m.Key)
}
