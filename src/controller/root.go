package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

// Root control request of GoogleMap
type Root struct {
	Key string
}

// Get returns the template file with GoogleMapAPI key
func (m *Root) Get(c echo.Context) error {
	return c.Render(http.StatusOK, "index", m.Key)
}
