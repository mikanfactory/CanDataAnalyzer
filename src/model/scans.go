// DON'T EDIT *** generated by scaneo *** DON'T EDIT //

package model

import "database/sql"

func ScanCan(r *sql.Row) (Can, error) {
	var s Can
	if err := r.Scan(
		&s.ID,
		&s.Target,
		&s.Time,
		&s.Longitude,
		&s.Latitude,
		&s.Speed,
		&s.Brake,
		&s.Accel,
		&s.AheadDistance,
		&s.CurveRadius,
		&s.SteeringAngle,
		&s.DistTollgate,
		&s.DistDivergence,
		&s.RoadType,
	); err != nil {
		return Can{}, err
	}
	return s, nil
}

func ScanCans(rs *sql.Rows) ([]Can, error) {
	structs := make([]Can, 0, 16)
	var err error
	for rs.Next() {
		var s Can
		if err = rs.Scan(
			&s.ID,
			&s.Target,
			&s.Time,
			&s.Longitude,
			&s.Latitude,
			&s.Speed,
			&s.Brake,
			&s.Accel,
			&s.AheadDistance,
			&s.CurveRadius,
			&s.SteeringAngle,
			&s.DistTollgate,
			&s.DistDivergence,
			&s.RoadType,
		); err != nil {
			return nil, err
		}
		structs = append(structs, s)
	}
	if err = rs.Err(); err != nil {
		return nil, err
	}
	return structs, nil
}

