package main

import (
	"flag"
	"os"

	"github.com/mikanfactory/CanDataAnalyzer/cmd"
)

func main() {
	flags := make(map[string]*bool)
	flags["listUp"] = flag.Bool("listUp", false, "list up all targets and write it")
	flags["insert"] = flag.Bool("insert", false, "convert raw data and insert it into DB")
	flags["schema"] = flag.Bool("schema", false, "write a DB schema to table.go")
	flags["table"] = flag.Bool("migrate", false, "create table")
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
	}
}
