package model

type Can struct {
  ID int64
  Target string
  Time int64
  Longitude float64
  Latitude float64
  Speed float64
  Brake int64
  Accel int64
  AheadDistance float64
  SteeringAngle float64
}