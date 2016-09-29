// If we introduce TypeScript, use for class.
// Just use as reference.

interface Setting {
  id:     number,               // unique
  target: string,
  title:  string,
}

interface Marker {
  id:          number,          // unique in same marker lists
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
  id:        number,            // unique
  settingID: number,
  ast:       AST,
  status:    string
}

interface AST {
  name: string,
  data: string | number,
  left: AST,
  right: AST,
}

interface Modal {
  modalType: string,
  settingID: number
}

type Operator = "=" | ">" | ">=" | "<" | "<="

type Status =
  "green" | "yellow" | "red" |
  "up" | "down" |
  "right" | "left" |
  "straight" | "stop" |
  "empty" | "normal"
