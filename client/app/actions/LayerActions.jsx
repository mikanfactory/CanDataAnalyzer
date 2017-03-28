import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const LayerActions = {
  createGridPoints: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_GRID_LAYER,
      bounds: bounds
    })
  },

  destroyGridPoints: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_GRID_LAYER
    })
  },

  createRectangle: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_RECTANGLE_LAYER
    })
  },

  destroyRectangle: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_RECTANGLE_LAYER
    })
  },

  changeRectToGrid: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_RECT_TO_GRID,
      bounds: bounds
    })
  },

  changeGridToRect: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CHANGE_GRID_TO_RECT,
      bounds: bounds
    })
  },

  updateBounds: bounds => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_BOUNDS,
      bounds: bounds
    })
  },

  destroyAllLayer: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_ALL_LAYER
    })
  },

  createHeatmapLayer: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_HEATMAP_LAYER
    })
  },

  destroyHeatmapLayer: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_HEATMAP_LAYER
    })
  },

  createClusters: (bounds, clusters, name) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_CLUSTER_LAYER,
      bounds: bounds,
      clusters: clusters,
      name: name
    })
  },

  destroyClusters: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_CLUSTER_LAYER
    })
  },

  createOverlayLayer: routeIndex => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_OVERLAY_LAYER,
      routeIndex: routeIndex
    })
  },

  destroyOverlayLayer: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_OVERLAY_LAYER
    })
  },

  createTaskIndexLayer: taskIndex => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_TASK_INDEX_LAYER,
      taskIndex: taskIndex
    })
  },

  destroyTaskIndexLayer: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_TASK_INDEX_LAYER
    })
  }
}

export default LayerActions
