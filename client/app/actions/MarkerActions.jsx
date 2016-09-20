import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'

export default {
  updateGoogleMap: gMap => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.UPDATE_GOOGLE_MAP,
      gMap: gMap
    })
  },

  addNewSetting: (target, settingID, markers) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ADD_NEW_SETTING,
      target: target,
      settingID: settingID,
      markers: markers
    })
  },

  addNewCondition: settingID => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ADD_NEW_CONDITION,
      settingID: settingID
    })
  },

  drawMarkers: settingID => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.DRAW_MARKERS,
      settingID: settingID
    })
  },

  eraseMarkers: settingID => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ERASE_MARKERS,
      settingID: settingID
    })
  },

  drawMarker: (id, settingID) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.DRAW_MARKER,
      id: id,
      settingID: settingID
    })
  },

  eraseMarker: (id, settingID) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ERASE_MARKER,
      id: id,
      settingID: settingID
    })
  },

  openModal: (settingID) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.OPEN_MODAL,
      settingID: settingID
    })
  },

  closeModal: () => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.CLOSE_MODAL
    })
  },

  newModal: () => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.NEW_MODAL
    })
  }
}
