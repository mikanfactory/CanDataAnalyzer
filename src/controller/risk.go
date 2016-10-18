package controller

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Risk control request of cluster
type Risk struct{}

func (m *Risk) Get(c echo.Context) error {
	cluster, err := model.ReadRiskConfig("data/output/result/")
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}
