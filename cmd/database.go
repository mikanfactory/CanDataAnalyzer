package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

const (
	DBConfig     = "root:@/summary"
	MetaDBConfig = "root:@/sp"
)

func CreateTable(dbconfig string) {
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	db, err := sql.Open("mysql", dbconfig)
	checkErr(err)

	q1 := createTableStr(cacheInfo)
	_, err = db.Exec(q1)
	checkErr(err)

	q2 := "create index targetIndex on cans(target)"
	_, err = db.Exec(q2)
	checkErr(err)
}

func DropTable(dbconfig string) {
	db, err := sql.Open("mysql", dbconfig)
	checkErr(err)

	query := "drop table if exists cans"
	_, err = db.Exec(query)
	checkErr(err)
}

func CleanTable(dbconfig string) {
	DropTable(dbconfig)
	CreateTable(dbconfig)
}

func createTableStr(cacheInfo CacheInfo) string {
	convertTypeMap := map[string]string{
		"int64":   "int",
		"float64": "float",
		"string":  "varchar(255)",
	}

	query := `CREATE TABLE cans (
  id int(11) NOT NULL PRIMARY KEY,
  target varchar(255) NOT NULL,
`
	for _, column := range cacheInfo.Columns {
		if column.Read {
			text := fmt.Sprintf("  %s %s NOT NULL,\n", column.Name, convertTypeMap[column.Type])
			query += text
		}
	}
	query = strings.TrimRight(query, ",\n")
	query += "\n)"

	return query
}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
