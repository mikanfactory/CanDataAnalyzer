// If we introduce TypeScript, use for class.
// Just use as reference.
interface MarkerLists {
  id:      number,              // unique
  target:  string,
  name:    string,              // unique
  markers: Array<Marker>
}

interface Marker {
  id:       number,             // unique in same marker lists
  position: Position,
  value:    string
}

interface Position {
  lat: number,
  lng: number
}

interface Condition {
  id:       number,             // unique
  feature:  string,
  operator: Operator,
  value:    number,
  status:   Status
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

interface Setting {
  id:         number,           // unique
  target:     string,
  title:      string,
  conditions: Array<Condition>
}

interface Modal {
  modalType:  string,
  settingID:  number
}
