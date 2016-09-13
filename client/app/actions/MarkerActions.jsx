import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'

export default {
  create: () => {},

  updateGoogleMap: gMap => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.UPDATE_GOOGLE_MAP,
      gMap: gMap
    })
  },

  toggleDisplay: () => {},

  toggleDisplayAll: () => {},

  destroy: () => {}
}
