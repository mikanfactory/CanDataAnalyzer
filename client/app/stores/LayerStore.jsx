import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import { defaultDivideSize } from '../constants/AppConstants'
const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  bounds: {},
  isGridLayerVisible: false,
  isRectangleVisibile: false,
  divideSize: defaultDivideSize,
}

function _create_grid_layer() {
  _store.gridPoints = true
}

function _destroy_grid_layer() {
  _store.gridPoints = false
}

function _create_rectangle() {
  _store.rectangleBounds = true
}

function _destroy_rectangle() {
  _store.rectangleBounds = false
}

function _setBounds(bounds) {
  _store.bounds = bounds
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
}

const LayerStore = new LayerStoreClass

LayerStore.dispatchToken = AppDispatcher.register((actions) => {
  switch (actions.actionType) {
    case ActionTypes._CREATE_GRID_LAYER:
      _create_grid_layer()
      _setBounds(actions.bounds)
      LayerStore.emitChange()
      break

    case ActionTypes._DESTROY_GRID_LAYER:
      _destroy_grid_layer()
      LayerStore.emitChange()
      break

    case ActionTypes.CREATE_RECTANGLE_LAYER:
      _create_rectangle(actions.bounds)
      _setBounds(actions.bounds)
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

    default:
      // do nothing
  }
})

export default LayerStore
