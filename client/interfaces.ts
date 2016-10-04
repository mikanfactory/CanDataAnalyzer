// If we introduce TypeScript, use for class.
// Now, just use as reference.

interface Setting {
  id:     number,               // unique
  target: string,
  title:  string,
  text:   string,
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
  content:   string,
  status:    string
}

interface Modal {
  modalType: string,
  settingID: number
}

interface Message {
  text: string
}

interface Grid {
  width:     number,
  height:    number,
  meshSize:  number,
  NorthEast: Position,
}

interface Heatmap {
  grid:     Grid,
  statuses: Array<string>,
  weights:  Array<Array<number>>,
  settings: Array<Setting>
}

type Operator = "=" | ">" | ">=" | "<" | "<="

type Status =
  "green" | "yellow" | "red" |
  "up" | "down" |
  "right" | "left" |
  "straight" | "stop" |
  "empty" | "normal"
