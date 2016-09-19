package controller

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Marker control request of Marker
type Marker struct{}

// Get return markers
func (m *Marker) Get(c echo.Context) error {
	setting := model.Setting{}
	if err := c.Bind(&setting); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	markers := &[]model.Marker{}
	if err := model.LoadMarkers(markers, setting); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusOK, markers)
}
