package model

import (
	"database/sql"
	"fmt"
	"reflect"
)

var statusToFilename = map[string]string{
	"green":    "./static/icon/green_car.png",
	"yellow":   "./static/icon/yellow_car.png",
	"red":      "./static/icon/red_car.png",
	"up":       "./static/icon/up.png",
	"down":     "./static/icon/down.png",
	"right":    "./static/icon/right.png",
	"left":     "./static/icon/left.png",
	"straight": "./static/icon/straight.png",
	"stop":     "./static/icon/stop_car.png",
	"empty":    "./static/icon/empty.png",
	"none":     "none",
}

func getCansByCondition(db *sql.DB, cond Condition, setting Setting) ([]Can, error) {
	var query string
	if cond.Content == "default" {
		query = fmt.Sprintf("select * from cans where target == \"%s\"", setting.Target)
	} else {
		query = fmt.Sprintf("select * from cans where target == \"%s\" AND %s",
			setting.Target, cond.Content)
	}
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	return ScanCans(rows)
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

func (m *Can) getPosition() Position {
	lat := m.GPSLatitude
	lng := m.GPSLongtitude

	// convert Tokyo Datum to WGS84
	lngW := lng - lat*0.000046038 - lng*0.000083043 + 0.010040
	latW := lat - lat*0.00010695 + lng*0.000017464 + 0.0046017

	return Position{
		Latitude:    latW,
		Longutitude: lngW,
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
