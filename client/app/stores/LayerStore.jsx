import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import { defaultDivideSize } from '../constants/AppConstants'
const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  gridPoints: [],
  divideSize: defaultDivideSize,
}

function _create_grid_points(gridPoints) {
  _store.gridPoints = gridPoints
}

function _destroy_grid_points() {
  _store.gridPoints = []
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

    default:
      // do nothing
  }
})

export default LayerStore
