import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const MarkerActions = {
  drawMarkers: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DRAW_MARKERS,
      settingID: settingID
    })
  },

  eraseMarkers: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.ERASE_MARKERS,
      settingID: settingID
    })
  },

  drawMarker: (id, settingID) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DRAW_MARKER,
      id: id,
      settingID: settingID
    })
  },

  eraseMarker: (id, settingID) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.ERASE_MARKER,
      id: id,
      settingID: settingID
    })
  },

  createMarkers: markers => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_MARKERS,
      markers: markers
    })
  },

  updateMarkers: (settingID, markers) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_MARKERS,
      settingID: settingID,
      markers: markers
    })
  }
}

export default MarkerActions
