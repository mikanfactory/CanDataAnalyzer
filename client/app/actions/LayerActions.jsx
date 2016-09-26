import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const LayerActions = {
  createLayers: layers => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_LAYERS,
      layers: layers
    })
  }
}

export default LayerActions
