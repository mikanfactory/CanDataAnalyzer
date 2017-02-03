package model

type Can struct {
  ID int64
  Target string
  Time float64
  Longitude float64
  Latitude float64
  Speed float64
  Brake int64
  Accel int64
  Engine float64
  AheadDistance float64
  Curve150 float64
  Curve100 float64
  Curve float64
  SteeringAngle float64
  BranchFlag int64
  DistTollgate float64
  RoadType int64
  GreenLamp int64
  RedLamp int64
  RightLamp int64
  UpLamp int64
  LeftLamp int64
  StopSign int64
  Limit30Sign int64
  Limit50Sign int64
  BrakeCar int64
  LeftCar int64
  ManBicycleCount int64
  ManBicycle int64
  DistManBicycle float64
  Pitch float64
  DistSignal float64
  PathType float64
  LaneCount int64
  AccelerationSpeed float64
  Jerk float64
  AverageVelocity float64
  MaxSpeed float64
  MinSpeed float64
  CurveAverage float64
}