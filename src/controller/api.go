package controller

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// API control request of apis
type API struct {
	DB        *sql.DB
	TargetDir string
}

func (m *API) GetMarkersBySetting(c echo.Context) error {
	setting := model.Setting{}
	if err := c.Bind(&setting); err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	markers := []model.Marker{}
	for _, cond := range setting.Conditions {
		ms, err := model.GetMarkersByCondition(m.DB, cond, setting)
		if err != nil {
			errorMessage := createErrorMessage(err)
			return c.JSON(http.StatusBadRequest, errorMessage)
		}
		markers = append(markers, ms...)
	}

	return c.JSON(http.StatusOK, &markers)
}

func (m *API) SaveHeatmapSetting(c echo.Context) error {
	heatmap := model.Heatmap{}
	if err := c.Bind(&heatmap); err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	if err := heatmap.SaveSetting(); err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	if err := heatmap.SaveData(); err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	message := model.Message{
		Code:    http.StatusOK,
		Content: "Saved heatmap setting!!!",
	}
	return c.JSON(http.StatusOK, message)
}

func (m *API) GetTask(c echo.Context) error {
	cluster, err := model.ReadClusterConfig("tasks", m.TargetDir)
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}

func (m *API) GetRisk(c echo.Context) error {
	cluster, err := model.ReadClusterConfig("risks", m.TargetDir)
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}

func (m *API) GetSwitchingPoint(c echo.Context) error {
	settingID, _ := strconv.ParseInt(c.Param("settingID"), 10, 0)

	markers := []model.Marker{}
	file, err := ioutil.ReadFile("data/middle/switch.json")
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusInternalServerError, errorMessage)
	}

	err = json.Unmarshal(file, &markers)
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusInternalServerError, errorMessage)
	}

	for i := range markers {
		markers[i].SettingID = int64(settingID)
	}

	return c.JSON(http.StatusOK, &markers)
}
