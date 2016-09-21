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

export { defaultSetting, defaultCondition }

const AppConstants = {
  ModalTypes: {
    NEW:  'New',
    EDIT: 'Edit',
    SHOW: 'Show'
  },

  ActionTypes: keyMirror({
    // Modal
    NEW_MODAL: null,
    OPEN_MODAL: null,
    CLOSE_MODAL: null,

    // GMap
    UPDATE_GOOGLE_MAP: null,

    // Setting
    ADD_NEW_SETTING: null,

    // Condition
    ADD_NEW_CONDITION: null,

    // Markers
    ADD_NEW_MARKERS: null,
    DRAW_MARKER: null,
    DRAW_MARKERS: null,
    ERASE_MARKER: null,
    ERASE_MARKERS: null
  }),
}

export default AppConstants
