import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'

export default {
  updateGoogleMap: gMap => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.UPDATE_GOOGLE_MAP,
      gMap: gMap
    })
  },

  drawMarkers: name => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.DRAW_MARKERS,
      name: name
    })
  },

  eraseMarkers: name => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ERASE_MARKERS,
      name: name
    })
  },

  drawMarker: (name, id) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.DRAW_MARKER,
      name: name,
      id: id
    })
  },

  eraseMarker: (name, id) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.ERASE_MARKER,
      name: name,
      id: id
    })
  },

  openModal: (id) => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.OPEN_MODAL,
      id: id
    })
  },

  closeModal: () => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.CLOSE_MODAL,
    })
  }
}
