package controller

import (
	"net/http"

	"github.com/mikanfactory/CanDataAnalyzer/src/model"
)

func createErrorMessage(err error) model.Message {
	errorMessage := model.Message{
		Code:    http.StatusBadRequest,
		Content: err.Error(),
	}

	return errorMessage
}
