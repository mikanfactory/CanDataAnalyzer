package model

type Can struct {
  ID int64
  Target string
  Latitude float64
  Longitude float64
  GPSSpeed float64
  Time float64
  Brake int64
  Accel int64
  SteeringAngle float64
  DetectCount int64
  AfternoonSun int64
  Shade int64
  Sunshine int64
  Cloud int64
}