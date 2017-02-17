package model

type Can struct {
  ID int64
  Target string
  Latitude float64
  Longitude float64
  GPSSpeed float64
  Time float64
  Brake float64
  Accel float64
  SteeringAngle float64
}