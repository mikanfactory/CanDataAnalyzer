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
		errorMessage := model.Error{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		}
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	markers := []model.Marker{}
	for _, cond := range setting.Conditions {
		ms, err := model.GetMarkersByCondition(m.DB, cond, setting)
		if err != nil {
			errorMessage := model.Error{
				Code:    http.StatusBadRequest,
				Message: err.Error(),
			}
			return c.JSON(http.StatusBadRequest, errorMessage)
		}
		markers = append(markers, ms...)
	}

	return c.JSON(http.StatusOK, &markers)
}
