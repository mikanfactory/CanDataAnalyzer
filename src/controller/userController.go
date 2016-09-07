package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

// UserController control request of GoogleMap
type UserController struct{}

// AddUserRoutes add route to echo server
func AddUserRoutes(e *echo.Echo) {
	c := &UserController{}

	e.GET("/", c.Get)
}

// Get returns the template file with GoogleMapAPI key
func (m *UserController) Get(c echo.Context) error {
	return c.Render(http.StatusOK, "index", "")
}
