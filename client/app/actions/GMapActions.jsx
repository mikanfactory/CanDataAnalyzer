import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const GMapActions = {
  updateGoogleMap: gMap => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_GOOGLE_MAP,
      gMap: gMap
    })
  }
}

export default GMapActions
