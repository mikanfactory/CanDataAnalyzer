package main

import (
	"database/sql"
	"flag"
	"html/template"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/mikanfactory/CanDataAnalyzer/cmd"
	"github.com/mikanfactory/CanDataAnalyzer/src/config"
	"github.com/mikanfactory/CanDataAnalyzer/src/controller"
)

const (
	addr   = ":1323"
	dbconf = "root:@/summary"
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
	db, err := sql.Open("mysql", dbconf)
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
	s.Engine.Renderer = t
}

// Route setting router for this app.
func (s *Server) Route() {
	api := &controller.API{DB: s.db}
	root := &controller.Root{}

	s.Engine.GET("/", root.Get)
	s.Engine.POST("/api/v1/marker", api.GetMarkersBySetting)
	s.Engine.POST("/api/v1/heatmap", api.SaveHeatmapSetting)
	s.Engine.GET("/api/v1/pedal/:settingID", api.GetSwitchingPoint)
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
	flags["preprocess"] = flag.Bool("preprocess", false, "detect switching point")
	flags["insertSP"] = flag.Bool("insertSP", false, "insert raw data into DB")
	flags["convertToJSON"] = flag.Bool("convertToJSON", false, "convert switching point to json")
	flags["createConfig"] = flag.Bool("createConfig", false, "extract header and make cache config")
	flags["convertToCSV"] = flag.Bool("convertToCSV", false, "convert switching point to csv")
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
	case *flags["preprocess"]:
		cmd.Preprocess()
		os.Exit(0)
	case *flags["insertSP"]:
		cmd.InsertSwitchingPoint()
		os.Exit(0)
	case *flags["convertToJSON"]:
		cmd.ConvertSwitchingPointToJSON()
		os.Exit(0)
	case *flags["convertToCSV"]:
		cmd.ConvertSwitchingPointToCSV()
		os.Exit(0)
	case *flags["createConfig"]:
		cmd.CreateConfig()
		os.Exit(0)
	}

	// Else, Run server
	s := New()
	s.Init()
	s.Route()
	s.Engine.Start(addr)
}
