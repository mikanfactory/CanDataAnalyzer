package controller

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Heatmap control request of Heatmap
type Heatmap struct{}

func (m *Heatmap) Save(c echo.Context) error {
	heatmap := model.Heatmap{}
	if err := c.Bind(&heatmap); err != nil {
		errorMessage := model.Message{
			Code:    http.StatusBadRequest,
			Content: err.Error(),
		}
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	if err := heatmap.SaveSetting(); err != nil {
		errorMessage := model.Message{
			Code:    http.StatusBadRequest,
			Content: err.Error(),
		}
		return c.JSON(http.StatusBadRequest, errorMessage)
	}
	if err := heatmap.SaveData(); err != nil {
		errorMessage := model.Message{
			Code:    http.StatusBadRequest,
			Content: err.Error(),
		}
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	message := model.Message{
		Code:    http.StatusOK,
		Content: "Saved heatmap setting!!!",
	}
	return c.JSON(http.StatusOK, message)
}
