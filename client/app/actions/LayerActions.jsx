import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const LayerActions = {
  createGridPoints: gridPoints => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_GRID_POINTS,
      gridPoints: gridPoints
    })
  },

  destroyGridPoints: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_GRID_POINTS
    })
  },

  createRectangle: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_RECTANGLE_LAYER,
      bounds: bounds
    })
  },

  destroyRectangle: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_RECTANGLE_LAYER
    })
  },

  changeRectToGrid: gridPoints => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_RECT_TO_GRID,
      gridPoints: gridPoints
    })
  },

  changeGridToRect: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_GRID_TO_RECT,
      bounds: bounds
    })
  }
}

export default LayerActions
