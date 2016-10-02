package cmd

import (
	"fmt"
	"io/ioutil"
)

func CreateGoSchema() {
	cacheInfo := CacheInfo{}
	readCacheConfig(&cacheInfo)

	schema := createGoSchemaStr(cacheInfo.Columns)
	content := []byte(schema)

	err := ioutil.WriteFile("db/table.go", content, 0744)
	checkErr(err)
}

func createGoSchemaStr(columns []Column) string {
	str := `package db

type Marker struct {
`

	for _, column := range columns {
		if column.Read {
			cl := fmt.Sprintf("  %s %s\n", column.Name, column.Type)
			str += cl
		}
	}

	str += "}"

	return str
}
