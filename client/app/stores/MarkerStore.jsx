import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  markers: [],
  invisibleMarkers: [],
}

function drawMarkers(sid) {
  _store.invisibleMarkers = _store.invisibleMarkers
                                  .filter( m => m.settingID !== sid )
}

function eraseMarkers(sid) {
  const markers = _store.markers
                        .filter( m => m.settingID === sid )
                        .map( m => ({ settingID: sid, id: m.id }) )
  const umarkers = uniqWith([..._store.invisibleMarkers, ...markers], isEqual)
  _store.invisibleMarkers = umarkers
}

function drawMarker(id, sid) {
  const invs = _store.invisibleMarkers
                     .filter( m => m.settingID !== sid || m.id !== id)
  _store.invisibleMarkers = invs
}

function eraseMarker(id, sid) {
  const invs = [..._store.invisibleMarkers, { settingID: sid, id: id }]
  _store.invisibleMarkers = uniqWith(invs, isEqual)
}

class MarkerStoreClass extends EventEmitter {
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

  getAllMarkers() {
    return _store.markers
  }

  getMarkers(settingID) {
    return _store.markers
                 .filter( m => m.settingID == settingID )
  }

  getAllInvisibles() {
    return _store.invisibleMarkers
  }

  getInvisibles(settingID) {
    return _store.invisibleMarkers
                 .filter( m => m.settingID == settingID )
  }
}

const MarkerStore = new MarkerStoreClass()

MarkerStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.DRAW_MARKERS:
      drawMarkers(action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.ERASE_MARKERS:
      eraseMarkers(action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.DRAW_MARKER:
      drawMarker(action.id, action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.ERASE_MARKER:
      eraseMarker(action.id, action.settingID)
      MarkerStore.emitChange()
      break

    default:
      return true
  }
})

export default MarkerStore
