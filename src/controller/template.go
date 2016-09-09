package controller

import (
	"html/template"
	"io"

	"github.com/labstack/echo"
)

type TemplateController struct {
	Templates *template.Template
}

func (t *TemplateController) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.Templates.ExecuteTemplate(w, name, data)
}
