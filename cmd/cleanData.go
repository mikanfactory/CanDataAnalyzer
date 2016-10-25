package cmd

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func CleanData() {
	db, err := sql.Open("sqlite3", dbConfig)
	checkErr(err)

	update1(db)
	update2(db)
	// fmt.Println(db)
}

func update1(db *sql.DB) {
	query := "UPDATE cans SET GPSLatitude = GPSLatitude - 0.0001894 WHERE target = \"021108K3KGm\""
	_, err := db.Exec(query)
	checkErr(err)
}

func update2(db *sql.DB) {
	query := "UPDATE cans SET GPSLatitude = GPSLatitude - 0.0001800 WHERE target = \"021108K4KHm\""
	_, err := db.Exec(query)
	checkErr(err)
}
