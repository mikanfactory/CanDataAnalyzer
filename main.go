package main

import (
	"database/sql"
	"flag"
	"html/template"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"

	"github.com/labstack/echo"
	"github.com/labstack/echo/engine/standard"
	"github.com/labstack/echo/middleware"
	"github.com/mikanfactory/CanDataAnalyzer/cmd"
	"github.com/mikanfactory/CanDataAnalyzer/src/config"
	"github.com/mikanfactory/CanDataAnalyzer/src/controller"
)

const (
	addr   = ":1323"
	dbconf = "db/sqlite3.db"
)

// Server is whole server implementation for this app.
// This holds router settings based on echo.
type Server struct {
	db     *sql.DB
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
	db, err := sql.Open("sqlite3", dbconf)
	if err != nil {
		log.Fatal(err)
	}
	s.db = db

	s.Config = config.LoadConfig()

	s.Engine.Use(middleware.Logger())
	s.Engine.Use(middleware.Recover())
	s.Engine.Use(middleware.Gzip())

	s.Engine.Static("/static", "public")

	t := &controller.TemplateController{
		Templates: template.Must(template.ParseGlob("src/view/*.tmpl")),
	}
	s.Engine.SetRenderer(t)
}

// Route setting router for this app.
func (s *Server) Route() {
	api := &controller.API{DB: s.db}
	root := &controller.Root{}

	s.Engine.GET("/", root.Get)
	s.Engine.POST("/api/v1/marker", api.GetMarkersBySetting)
	s.Engine.POST("/api/v1/heatmap", api.SaveHeatmapSetting)
	s.Engine.GET("/api/v1/task", api.GetTask)
	s.Engine.GET("/api/v1/risk", api.GetRisk)
}

func main() {
	// Run command
	flags := make(map[string]*bool)
	flags["listUp"] = flag.Bool("listUp", false, "list up all targets and write it")
	flags["insert"] = flag.Bool("insert", false, "convert raw data and insert it into DB")
	flags["schema"] = flag.Bool("schema", false, "write a DB schema to table.go")
	flags["table"] = flag.Bool("migrate", false, "create table")
	flags["clean"] = flag.Bool("cleaning", false, "clean up data")
	flags["detect"] = flag.Bool("detect", false, "detect switching point")
	flag.Parse()

	switch {
	case *flags["listUp"]:
		cmd.ListUpTargets()
		os.Exit(0)
	case *flags["insert"]:
		cmd.InsertData()
		os.Exit(0)
	case *flags["schema"]:
		cmd.CreateGoSchema()
		os.Exit(0)
	case *flags["table"]:
		cmd.CreateTable()
		os.Exit(0)
	case *flags["clean"]:
		cmd.CleanData()
		os.Exit(0)
	case *flags["detect"]:
		cmd.DetectSwitchingPoint()
		os.Exit(0)
	}

	// Else, Run server
	s := New()
	s.Init()
	s.Route()
	s.Engine.Run(standard.New(addr))
}
