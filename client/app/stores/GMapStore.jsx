import AppDispatcher from '../dispatcher/AppDispatcher'

import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  gMap: {},
}

function _updateMap(gMap) {
  _store.gMap = gMap
}

class GMapStoreClass extends EventEmitter {
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
    this.removeListener(CHANGE_EVENT, callback)
  }

  getMap() {
    return _store.gMap
  }
}

const GMapStore = new GMapStoreClass()

GMapStore.dispatchToken = AppDispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.UPDATE_GOOGLE_MAP:
      _updateMap(action.gMap)
      GMapStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default GMapStore
