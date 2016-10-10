package controller

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// Cluster control request of cluster
type Cluster struct{}

func (m *Cluster) Get(c echo.Context) error {
	cluster, err := model.ReadClusterConfig("data/output/2016-10-06_17:58:18/")
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}
