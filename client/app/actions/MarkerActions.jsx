import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'

export default {
  create: () => {},

  updateGoogleMap: map => {
    AppDispatcher.dispatch({
      actionType: MarkerConstants.UPDATE_GOOGLE_MAP,
      map: map
    })
  },

  toggleDisplay: () => {},

  toggleDisplayAll: () => {},

  destroy: () => {}
}
