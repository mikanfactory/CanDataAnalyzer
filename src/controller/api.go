package controller

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo"
	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

// API control request of apis
type API struct {
	DB *sql.DB
}

const targetDir = "data/output/d3/result/"

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
	cluster, err := model.ReadClusterConfig("tasks", targetDir)
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}

func (m *API) GetRisk(c echo.Context) error {
	cluster, err := model.ReadClusterConfig("risks", targetDir)
	if err != nil {
		errorMessage := createErrorMessage(err)
		return c.JSON(http.StatusBadRequest, errorMessage)
	}

	return c.JSON(http.StatusOK, &cluster)
}

func (m *API) GetNextPedalOnOff(c echo.Context) error {
	targets := &model.Targets{}
	file, _ := ioutil.ReadFile("config/targets.json")
	json.Unmarshal(file, targets)

	markers := []model.Marker{}
	for _, target := range targets.Names {
		cs, _ := model.GetSwitchPoint(m.DB, target)
		pairs := model.TwoPairs(cs)

		for _, p := range pairs {
			if p[0].Accel == -1 {
				status := ""
				switch {
				case p[1].Brake == 2 && model.CalcDiffSecond(p) < 2:
					status = "BrakeOn"
				case p[1].Brake == 2 && model.CalcDiffSecond(p) >= 2:
					status = "BrakeOff"
				case p[1].Accel == 2 && model.CalcDiffSecond(p) < 5:
					status = "AccelOn"
				case p[1].Accel == 2 && model.CalcDiffSecond(p) >= 5:
					status = "AccelOff"
				}

				setting := model.Setting{ID: 100}
				cond := model.Condition{Status: status}
				marker := p[0].ToMarker(cond, setting)
				markers = append(markers, marker)
			}
		}
	}

	return c.JSON(http.StatusOK, &markers)
}
