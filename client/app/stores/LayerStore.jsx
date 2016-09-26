import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import { defaultDivideSize } from '../constants/AppConstants'
const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  gridPoints: [],
  divideSize: defaultDivideSize,
  rectangleBounds: {}
}

function _create_grid_points(gridPoints) {
  _store.gridPoints = gridPoints
}

function _destroy_grid_points() {
  _store.gridPoints = []
}

function _create_rectangle(bounds) {
  _store.rectangleBounds = bounds
}

function _destroy_rectangle() {
  _store.rectangleBounds = {}
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

  getGridPoints() {
    return _store.gridPoints
  }

  getDivideSize() {
    return _store.divideSize
  }

  getRectangleBounds() {
    return _store.rectangleBounds
  }
}

const LayerStore = new LayerStoreClass

LayerStore.dispatchToken = AppDispatcher.register((actions) => {
  switch (actions.actionType) {
    case ActionTypes.CREATE_GRID_POINTS:
      _create_grid_points(actions.gridPoints)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_GRID_POINTS:
      _destroy_grid_points()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_RECTANGLE_LAYER:
      _create_rectangle(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes.DESTROY_RECTANGLE_LAYER:
      _destroy_rectangle()
      LayerStore.emitChange()
      break

    case ActionTypes.CHANGE_RECT_TO_GRID:
      _destroy_rectangle()
      _create_grid_points(actions.gridPoints)
      LayerStore.emitChange()
      break

    case ActionTypes.CHANGE_GRID_TO_RECT:
      _destroy_grid_points()
      _create_rectangle(actions.bounds)
      LayerStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default LayerStore
