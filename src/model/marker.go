package model

import "database/sql"

func GetMarkersByCondition(db *sql.DB, cond Condition, setting Setting) ([]Marker, error) {
	cs, err := getCansByCondition(db, cond, setting)
	if err != nil {
		return nil, err
	}

	markers := []Marker{}
	for _, can := range cs {
		markers = append(markers, can.ToMarker(cond, setting))
	}

	return markers, nil
}
