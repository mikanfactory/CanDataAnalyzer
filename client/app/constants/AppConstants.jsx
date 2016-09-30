import keyMirror from 'keymirror'
import targets from '../../../config/targets.json'
import features from '../../../config/cacheConfig.json'

const validFeatures = features.columns
                              .filter( c => c.read )
                              .map( c => c.name )

const defaultSetting = {
  id: 0,
  target: "021021K1KAm",
  title: "default",
  text: `switch (true) {
  case SpeedPerHourLowpass > 50 && (BrakeOnOff == 1 || AccelOnOff == 1):
    return red
  case SpeedPerHourLowpass < 10:
    return stop
  default:
    return none
}`
}

const defaultDivideSize = 10

const defaultModal = {
  modalType: "",
  settingID: 0
}

const NUMBERS = [
  "Single",
  "Double",
  "Triple"
]

const LOGICS = [
  "and",
  "or"
]

const TARGETS = [
  "Target",
  ...targets.names
 ]

const FEATURES = [
  ...validFeatures
]

const OPERATORS = [
  "<", "<=", "==", ">=", ">"
]

const STATUS = [
  "green", "yellow", "red",
  "up", "down", "right", "left",
  "straight", "stop",
  "empty", "none"
]


export { defaultSetting, defaultModal, defaultDivideSize }
export { NUMBERS, LOGICS, TARGETS, FEATURES, OPERATORS, STATUS }

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
    UPDATE_CONDITION: null,

    // Marker
    CREATE_MARKERS: null,
    UPDATE_MARKERS: null,
    DRAW_MARKER: null,
    DRAW_MARKERS: null,
    ERASE_MARKER: null,
    ERASE_MARKERS: null,

    // Layer
    CREATE_GRID_LAYER: null,
    DESTROY_GRID_LAYER: null,
    CREATE_RECTANGLE_LAYER: null,
    DESTROY_RECTANGLE_LAYER: null,
    CHANGE_RECT_TO_GRID: null,
    CHANGE_GRID_TO_RECT: null,
    UPDATE_BOUNDS: null,
    DESTROY_ALL_LAYER: null,
    CREATE_HEATMAP_LAYER: null,
    DESTROY_HEATMAP_LAYER: null
  }),
}

export default AppConstants
