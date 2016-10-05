import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import SettingStore from './SettingStore'
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

function _createMarkers(markers) {
  const ms = markers.filter( m => m.image !== "none" )
  _store.markers = [..._store.markers, ...ms]
}

function _updateMarkers(sid, markers) {
  _store.markers = _store.markers
                         .filter( m => m.settingID !== sid)
  _store.markers = [..._store.markers, ...markers]
}

function _destroyMarkers(sid) {
  _store.markers = _store.markers.filter( m => m.settingID !== sid)
}

function _drawMarkers(sid) {
  _store.invisibleMarkers = _store.invisibleMarkers
                                  .filter( m => m.settingID !== sid )
}

function _eraseMarkers(sid) {
  const markers = _store.markers
                        .filter( m => m.settingID === sid )
                        .map( m => ({ settingID: sid, id: m.id }) )
  const umarkers = uniqWith([..._store.invisibleMarkers, ...markers], isEqual)
  _store.invisibleMarkers = umarkers
}

function _drawMarker(id, sid) {
  const invs = _store.invisibleMarkers
                     .filter( m => m.settingID !== sid || m.id !== id)
  _store.invisibleMarkers = invs
}

function _eraseMarker(id, sid) {
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

  getInvisibles(settingID) {
    return _store.invisibleMarkers
                 .filter( m => m.settingID == settingID )
  }
}

const MarkerStore = new MarkerStoreClass()

MarkerStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.CREATE_MARKERS:
      _createMarkers(action.markers)
      MarkerStore.emitChange()
      break

    case ActionTypes.UPDATE_MARKERS:
      _updateMarkers(action.settingID, action.markers)
      MarkerStore.emitChange()
      break

    case ActionTypes.DESTROY_SETTINGS:
      AppDispatcher.waitFor([SettingStore.dispatchToken])
      _destroyMarkers(action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.DRAW_MARKERS:
      _drawMarkers(action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.ERASE_MARKERS:
      _eraseMarkers(action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.DRAW_MARKER:
      _drawMarker(action.id, action.settingID)
      MarkerStore.emitChange()
      break

    case ActionTypes.ERASE_MARKER:
      _eraseMarker(action.id, action.settingID)
      MarkerStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default MarkerStore
