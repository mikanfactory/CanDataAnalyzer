package model

import (
	"database/sql"
	"fmt"
	"reflect"
)

var statusToFilename = map[string]string{
	"green":    "./static/icon/green.png",
	"yellow":   "./static/icon/yellow.png",
	"red":      "./static/icon/red.png",
	"up":       "./static/icon/up.png",
	"down":     "./static/icon/down.png",
	"right":    "./static/icon/right.png",
	"left":     "./static/icon/left.png",
	"straight": "./static/icon/straight.png",
	"stop":     "./static/icon/stop.png",
	"empty":    "./static/icon/empty.png",
	"none":     "none",
}

func (m *Can) ToMarker(cond Condition, setting Setting) Marker {
	return Marker{
		ID:          m.ID,
		SettingID:   setting.ID,
		Image:       statusToFilename[cond.Status],
		Position:    m.getPosition(),
		Description: m.getDescription(),
	}
}

func getCans(db *sql.DB, cond Condition, setting Setting) ([]Can, error) {
	switch {
	case setting.Target == "All" && cond.Content == "default":
		return getAllCans(db)
	case setting.Target == "All":
		return getCansForAllTarget(db, cond)
	case cond.Content == "default":
		return getCansByDefaultCondition(db, setting)
	default:
		return getCansByCondition(db, cond, setting)
	}
}

func getAllCans(db *sql.DB) ([]Can, error) {
	query := "select * from cans"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return ScanCans(rows)
}

func getCansForAllTarget(db *sql.DB, cond Condition) ([]Can, error) {
	query := fmt.Sprintf("select * from cans where %s", cond.Content)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return ScanCans(rows)
}

func getCansByDefaultCondition(db *sql.DB, setting Setting) ([]Can, error) {
	query := fmt.Sprintf("select * from cans where target == \"%s\"", setting.Target)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return ScanCans(rows)
}

func getCansByCondition(db *sql.DB, cond Condition, setting Setting) ([]Can, error) {
	query := fmt.Sprintf("select * from cans where target == \"%s\" AND %s",
		setting.Target, cond.Content)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return ScanCans(rows)
}

func (m *Can) getPosition() Position {
	lat := m.Latitude
	lng := m.Longitude

	// convert Tokyo Datum to WGS84
	// lngW := lng - lat*0.000046038 - lng*0.000083043 + 0.010040
	// latW := lat - lat*0.00010695 + lng*0.000017464 + 0.0046017

	return Position{
		Latitude:    lat,
		Longutitude: lng,
	}
}

func (m *Can) getDescription() string {
	description := ""

	v := reflect.ValueOf(m).Elem()
	t := v.Type()
	for i := 0; i < v.NumField(); i++ {
		f := v.Field(i)
		cmp := fmt.Sprintf("<div class='feature'> %s: %v</div>", t.Field(i).Name, f.Interface())
		description += cmp + "\n"
	}

	return description
}
