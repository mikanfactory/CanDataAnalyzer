package main

import (
	"html/template"

	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"github.com/mikanfactory/CanDataAnalyzer/src/config"
	"github.com/mikanfactory/CanDataAnalyzer/src/controller"
)

const addr = ":1323"

// Server is whole server implementation for this app.
// This holds router settings based on echo.
type Server struct {
	Engine *echo.Echo
	Config *config.Config
}

// New returns server object.
func New() *Server {
	e := echo.New()
	return &Server{Engine: e}
}

// Init initialize server state. Read Config files, compiling templates,
// and apply middleware.
func (s *Server) Init() {
	s.Config = config.LoadConfig()

	s.Engine.Use(middleware.Logger())
	s.Engine.Use(middleware.Recover())

	s.Engine.Static("/static", "public")

	t := &controller.TemplateController{
		Templates: template.Must(template.ParseGlob("src/view/*.tmpl")),
	}
	s.Engine.SetRenderer(t)
}

// Route setting router for this app.
func (s *Server) Route() {
	marker := &controller.Marker{}
	googleMap := &controller.GoogleMap{Key: s.Config.GoogleMap.Key}

	s.Engine.GET("/", googleMap.Get)
	s.Engine.GET("/api/v1/speed.json", marker.GetSpeed)
}

func main() {
	s := New()
	s.Init()
	s.Route()
	s.Engine.Run(standard.New(addr))
}
