package controller

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Marker control request of Marker
type Marker struct {
	DB *sql.DB
}

// Get return markers
func (m *Marker) Get(c echo.Context) error {
	setting := model.Setting{}
	if err := c.Bind(&setting); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	markers := []model.Marker{}
	for _, cond := range setting.Conditions {
		ms, err := model.GetMarkersByCondition(m.DB, cond, setting)
		if err != nil {
			return c.JSON(http.StatusBadRequest, err.Error())
		}
		markers = append(markers, ms...)
	}

	return c.JSON(http.StatusOK, markers)
}
