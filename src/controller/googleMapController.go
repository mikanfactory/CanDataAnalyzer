package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

// GoogleMapController control request of GoogleMap
type GoogleMapController struct{}

// AddGoogleMapRoutes add route to echo server
func AddGoogleMapRoutes(e *echo.Echo) {
	c := &GoogleMapController{}

	e.GET("/", c.Get)
}

// Get returns the template file with GoogleMapAPI key
func (m *GoogleMapController) Get(c echo.Context) error {
	return c.Render(http.StatusOK, "index", "")
}
