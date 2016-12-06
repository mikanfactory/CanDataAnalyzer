package model

import "database/sql"

func GetMarkersByCondition(db *sql.DB, cond Condition, setting Setting) ([]Marker, error) {
	cs, err := getCans(db, cond, setting)
	if err != nil {
		return nil, err
	}

	markers := []Marker{}
	for _, can := range cs {
		markers = append(markers, can.ToMarker(cond, setting))
	}

	return markers, nil
}

func TwoPairs(cs []Can) [][]Can {
	acc := [][]Can{}
	for i := 0; i < len(cs)-1; i++ {
		acc = append(acc, cs[i:i+2])
	}

	return acc
}
