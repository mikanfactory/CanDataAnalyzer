package model

type Can struct {
  ID int64
  Target string
  FrameIndex int64
  FrameImageIndex int64
  GPSLatitude float64
  GPSLongtitude float64
  SpeedPerHourLowpass float64
  BrakeOnOff float64
  AcceleratorOnOff float64
  WinkerRight float64
  WinkerLeft float64
  HazardOnOff float64
  SteeringAngle float64
  AheadDistance float64
  AheadRelativitySpeed float64
}