import keyMirror from 'keymirror'
import targets from '../../../config/targets.json'
import features from '../../../config/cacheConfig.json'
import chunk from 'lodash/chunk'

const validFeatures = features.columns
                              .filter( c => c.read )
                              .map( c => c.name )

const settingTextHeader = chunk(validFeatures, 3)
  .map( c => "// " + c.join(" "))
  .join("\n")

const validStatuses = chunk([
  "green", "yellow", "red",
  "up", "down", "right", "left",
  "straight", "stop",
  "empty", "none"
], 4)
  .map( c => "// " + c.join(" "))
  .join("\n")

const defaultSetting = {
  id: 0,
  target: "021021K1KAm",
  title: "default",
  text: [
    "// features",
    settingTextHeader,
    "",
    "// statuses",
    validStatuses,
    "",
    "switch (true) {",
    "  case SpeedPerHourLowpass > 60:",
    "    return red",
    "  case SpeedPerHourLowpass > 30 && SpeedPerHourLowpass < 60:",
    "    return yellow",
    "  case SpeedPerHourLowpass > 10 && SpeedPerHourLowpass < 30:",
    "    return green",
    "  case SpeedPerHourLowpass < 10:",
    "    return stop",
    "}"
  ].join("\n")
}

const defaultDivideSize = 40

const defaultModal = {
  modalType: "",
  settingID: 0
}

const TARGETS = [
  "Target",
  "All",
  ...targets.names
 ]

const FEATURES = [
  ...validFeatures
]


export { defaultSetting, defaultModal, defaultDivideSize }
export { TARGETS, FEATURES }

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

    // Setting
    CREATE_SETTINGS: null,
    UPDATE_SETTING: null,
    DESTROY_SETTING: null,

    // GMap
    UPDATE_GOOGLE_MAP: null,

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
    DESTROY_HEATMAP_LAYER: null,
    CREATE_CLUSTER_LAYER: null,
    DESTROY_CLUSTER_LAYER: null,
    CREATE_OVERLAY_LAYER: null,
    DESTROY_OVERLAY_LAYER: null,

    // Message
    CREATE_MESSAGE: null,
    DESTROY_MESSAGE: null
  }),
}

export default AppConstants
