package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mikanfactory/CanDataAnalyzer/src/config"
)

func CreateTable(dest string) {
	conf := config.LoadConfig()

	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	db, err := sql.Open("mysql", conf.DB.MysqlConf(dest))
	checkErr(err)

	q1 := createTableStr(cacheInfo)
	_, err = db.Exec(q1)
	checkErr(err)

	q2 := "create index targetIndex on cans(target)"
	_, err = db.Exec(q2)
	checkErr(err)
}

func DropTable(dest string) {
	conf := config.LoadConfig()
	db, err := sql.Open("mysql", conf.DB.MysqlConf(dest))
	checkErr(err)

	query := "drop table if exists cans"
	_, err = db.Exec(query)
	checkErr(err)
}

func CleanTable(dest string) {
	DropTable(dest)
	CreateTable(dest)
}

func createTableStr(cacheInfo CacheInfo) string {
	convertTypeMap := map[string]string{
		"int64":   "int",
		"float64": "float",
		"string":  "varchar(255)",
	}

	query := `CREATE TABLE cans (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  target varchar(255) NOT NULL,
`
	for _, column := range cacheInfo.Columns {
		if column.Read {
			if isLngLat(column) {
				text := fmt.Sprintf("  %s %s NOT NULL,\n", column.Name, "double")
				query += text
			} else {
				text := fmt.Sprintf("  %s %s NOT NULL,\n", column.Name, convertTypeMap[column.Type])
				query += text
			}
		}
	}
	query = strings.TrimRight(query, ",\n")
	query += "\n)"

	return query
}

func isLngLat(column Column) bool {
	return column.Name == "Latitude" || column.Name == "Longitude"
}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
