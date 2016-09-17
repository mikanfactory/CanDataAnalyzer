package controller

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Marker control request of Marker
type Marker struct{}

func (m *Marker) Get(c echo.Context) error {
	markers := []model.Marker{}
	markers.FindByName()

	data := model.Markers{Name: "Speed", Markers: markers}

	return c.JSON(http.StatusOK, data)
}
