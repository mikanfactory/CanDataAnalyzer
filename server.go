package main

import (
	"html/template"

	"./src/controller"

	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
)

const addr = ":1323"

// Server is whole server implementation for this app.
// This holds router settings based on echo.
type Server struct {
	Engine *echo.Echo
}

// New returns server object.
func New() *Server {
	e := echo.New()
	return &Server{Engine: e}
}

// Init initialize server state. Read Config files, compiling templates,
// and apply middleware.
func (s *Server) Init() {
	s.Engine.Static("/static", "public")

	t := &controller.TemplateController{
		Templates: template.Must(template.ParseGlob("src/view/*.tmpl")),
	}
	s.Engine.SetRenderer(t)
}

// Route setting router for this app.
func (s *Server) Route() {
	controller.AddGoogleMapRoutes(s.Engine)
}

func main() {
	s := New()
	s.Init()
	s.Route()
	s.Engine.Run(standard.New(addr))
}
