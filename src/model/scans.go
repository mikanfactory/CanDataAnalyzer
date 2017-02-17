// DON'T EDIT *** generated by scaneo *** DON'T EDIT //

package model

import "database/sql"

func ScanCan(r *sql.Row) (Can, error) {
	var s Can
	if err := r.Scan(
		&s.ID,
		&s.Target,
		&s.Latitude,
		&s.Longitude,
		&s.GPSSpeed,
		&s.Time,
		&s.Brake,
		&s.Accel,
		&s.SteeringAngle,
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
			&s.Latitude,
			&s.Longitude,
			&s.GPSSpeed,
			&s.Time,
			&s.Brake,
			&s.Accel,
			&s.SteeringAngle,
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

