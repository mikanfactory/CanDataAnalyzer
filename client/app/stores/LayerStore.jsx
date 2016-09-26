import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  layers: []
}

function _create_layers(layers) {
  _store.layers = layers
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

  getLayers() {
    return _store.layers
  }
}

const LayerStore = new LayerStoreClass

LayerStore.dispatchToken = AppDispatcher.register((actions) => {
  switch (actions.actionType) {
    case ActionTypes.CREATE_LAYERS:
      _create_layers(actions.layers)
      LayerStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default LayerStore
