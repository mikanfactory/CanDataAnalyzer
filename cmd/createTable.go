package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

const dbConfig = "db/sqlite3.db"

func CreateTable() {
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	err := os.Remove(dbConfig)
	checkErr(err)

	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	q1 := createTableStr(cacheInfo)
	_, err = db.Exec(q1)
	checkErr(err)

	q2 := "create index targetIndex on markers(target)"
	_, err = db.Exec(q2)
	checkErr(err)
}

func createTableStr(cacheInfo CacheInfo) string {
	convertTypeMap := map[string]string{
		"int64":   "INTEGER",
		"float64": "REAL",
		"string":  "TEXT",
	}

	query := `CREATE TABLE markers (
  id INTEGER NOT NULL PRIMARY KEY,
  target TEXT NOT NULL,
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
