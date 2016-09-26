import keyMirror from 'keymirror'

const defaultSetting = {
  id: 0,
  target: "021021K1KAm",
  title: "default"
}

const defaultCondition = {
  id: 0,
  settingID: 0,
  feature: "AccelerationX",
  operator: "<",
  value: 10,
  status: "stop"
}

const defaultModal = {
  modalType: "",
  settingID: 0
}

const TARGETS = [
  "Target",
  "021021K1KAm",
  "021022K1KAm",
  "021023K1KAm",
  "021024K1KAm",
  "021025K1KAm",
  "021026K1KAm",
  "021027K1KAm",
  "021028K1KAm",
  "021029K1KAm",
  "021030K1KAm",
  "021031K1KAm",
  "021101K1KAm",
  "021021K2KBm",
  "021023K2KBm",
  "021024K2KBm",
 ]

const FEATURES = [
  "AccelerationX",
  "GPSLatitude",
  "GPSLongtitude",
  "MapLongtitude",
  "MapLatitude",
  "SpeedPerHourLowpass",
  "BrakeOnOff",
  "BrakeOnOff",
  "AcceleratorOnOff",
  "Steering Angle",
  "AheadDistance",
  "AheadRelativitySpeed"
]

const OPERATORS = [
  "<", "<=", "==", ">=", ">"
]

const STATUS = [
  "green", "yellow", "red",
  "up", "down", "right", "left",
  "straight", "stop",
  "empty", "normal"
]


export { defaultSetting, defaultCondition, defaultModal }
export { TARGETS, FEATURES, OPERATORS, STATUS }

const AppConstants = {
  ModalTypes: {
    NEW:  'New',
    EDIT: 'Edit',
    SHOW: 'Show'
  },

  ActionTypes: keyMirror({
    // Modal
    CREATE_MODAL: null,
    OPEN_MODAL: null,
    CANCEL_MODAL: null,
    CLOSE_MODAL: null,

    // GMap
    UPDATE_GOOGLE_MAP: null,

    // Condition
    CREATE_CONDITION: null,
    UPDATE_CONDITION: null,
    REMOVE_CONDITION: null,

    // Marker
    CREATE_MARKERS: null,
    UPDATE_MARKERS: null,
    DRAW_MARKER: null,
    DRAW_MARKERS: null,
    ERASE_MARKER: null,
    ERASE_MARKERS: null,

    // Layer
    CREATE_GRID_POINTS: null,
    DESTROY_GRID_POINTS: null,
    CREATE_RECTANGLE_LAYER: null,
    DESTROY_RECTANGLE_LAYER: null,
  }),
}

export default AppConstants
