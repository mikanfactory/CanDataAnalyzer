// If we introduce TypeScript, use for class.
// Just use as reference.

interface Setting {
  id:     number,               // unique
  target: string,
  title:  string,
}

interface Marker {
  id:          number,             // unique in same marker lists
  settingID:   number,
  image:       string,
  position:    Position,
  description: string
}

interface Position {
  lat: number,
  lng: number
}

interface Condition {
  id:         number,            // unique
  settingID:  number,
  detailsNum: number,
  logics:     Array<string>,
  status:     Status
}

interface Details {
  id: number,
  conditionID: number,
  feature:   string,
  operator:  Operator,
  value:     number,
}

interface Modal {
  modalType: string,
  settingID: number
}

enum Operator {
  Equal                = "=",
  GreaterThan          = ">",
  GreaterThanOrEqualTo = ">="
  LessThan             = "<",
  LessThanOrEqualTo    = "<="
}

enum Status {
  Green    = "green",
  Yello    = "yellow",
  Red      = "red",
  Up       = "up",
  Down     = "down",
  Right    = "right",
  Left     = "left",
  Straight = "straight",
  Stop     = "stop",
  Empty    = "empty",
  Normal   = "normal"
}
