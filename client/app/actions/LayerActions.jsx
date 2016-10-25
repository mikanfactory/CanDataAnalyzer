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

  createClusters: (bounds, clusters) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_CLUSTER_LAYER,
      bounds: bounds,
      clusters: clusters
    })
  },

  destroyClusters: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_CLUSTER_LAYER
    })
  },

  createRiskLayer: (bounds, risks) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_RISK_LAYER,
      bounds: bounds,
      risks: risks
    })
  },

  createRouteIndex: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_ROUTE_INDEX
    })
  }
}

export default LayerActions
