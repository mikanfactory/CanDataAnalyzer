import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import { defaultDivideSize } from '../constants/AppConstants'
import forEach from 'lodash/forEach'
const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

/* const defaultNorthEastN = {"lat":35.52267708938041,"lng":139.49197348808286}
 * const defaultSouthWestN = {"lat":35.400868859909764,"lng":139.30533465599058}*/
const defaultNorthEast = { "lng": 140.2168243811035, "lat": 36.101798783406345 }
const defaultSouthWest = { "lng": 140.17163452362058, "lat": 36.07576268786503 }
const defaultBounds = new window.google.maps.LatLngBounds(defaultSouthWest, defaultNorthEast)

let _store = {
  bounds: defaultBounds,
  isGridLayerVisible: false,
  isRectangleVisibile: false,
  isHeatmapVisible: false,
  clusterName: "",
  assignedClusters: [],
  routeIndex: [],
  taskIndex: [],
  divideSize: defaultDivideSize,
}

function _create_grid_layer() {
  _store.isGridLayerVisible = true
}

function _destroy_grid_layer() {
  _store.isGridLayerVisible = false
}

function _create_rectangle() {
  _store.isRectangleVisibile = true
}

function _destroy_rectangle() {
  _store.isRectangleVisibile = false
}

function _setBounds(bounds) {
  _store.bounds = bounds
}

function _create_heatmap_layer() {
  _store.isHeatmapVisible = true
}

function _destroy_heatmap_layer() {
  _store.isHeatmapVisible = false
}

function _create_route_index(routeIndex) {
  _store.routeIndex = routeIndex
}

function _destroy_route_index() {
  _store.routeIndex = []
}

function _create_cluster_layer(bounds, clusters, name) {
  _store.bounds = bounds
  _store.assignedClusters = clusters
  _store.clusterName = name
}

function _destroy_cluster_layer() {
  _store.clusterName = ""
  _store.assignedClusters = []
}

function _create_task_index_layer(taskIndex) {
  _store.taskIndex = taskIndex
}

function _destroy_task_index_layer() {
  _store.taskIndex = []
}

class LayerStoreClass extends EventEmitter {
  constructor() {
    super()
  }

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeChangeListener(CHANGE_EVENT, callback)
  }

  getBounds() {
    return _store.bounds
  }

  getGridLayerVisibility() {
    return _store.isGridLayerVisible
  }

  getRectangleVisibility() {
    return _store.isRectangleVisibile
  }

  getHeatmapVisibility() {
    return _store.isHeatmapVisible
  }

  getAssignedClusters() {
    return _store.assignedClusters
  }

  getRouteIndex() {
    return _store.routeIndex
  }

  getTaskIndex() {
    return _store.taskIndex
  }

  getClusterName() {
    return _store.clusterName
  }
}

const LayerStore = new LayerStoreClass

LayerStore.dispatchToken = AppDispatcher.register((actions) => {
  switch (actions.actionType) {
    case ActionTypes.CREATE_GRID_LAYER:
      _create_grid_layer()
      _setBounds(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_GRID_LAYER:
      _destroy_grid_layer()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_RECTANGLE_LAYER:
      _create_rectangle()
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_RECTANGLE_LAYER:
      _destroy_rectangle()
      LayerStore.emitChange()
      break

    case ActionTypes.CHANGE_RECT_TO_GRID:
      _destroy_rectangle()
      _create_grid_layer()
      _setBounds(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes.CHANGE_GRID_TO_RECT:
      _destroy_grid_layer()
      _create_rectangle()
      _setBounds(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes.UPDATE_BOUNDS:
      _setBounds(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_ALL_LAYER:
      _destroy_grid_layer()
      _destroy_rectangle()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_HEATMAP_LAYER:
      _create_heatmap_layer()
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_HEATMAP_LAYER:
      _destroy_heatmap_layer()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_CLUSTER_LAYER:
      _create_cluster_layer(actions.bounds, actions.clusters, actions.name)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_CLUSTER_LAYER:
      _destroy_cluster_layer()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_OVERLAY_LAYER:
      _create_route_index(actions.routeIndex)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_OVERLAY_LAYER:
      _destroy_route_index()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_TASK_INDEX_LAYER:
      _create_task_index_layer(actions.taskIndex)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_TASK_INDEX_LAYER:
      _destroy_task_index_layer()
      LayerStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default LayerStore
