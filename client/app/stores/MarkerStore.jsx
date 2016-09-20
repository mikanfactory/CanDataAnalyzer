import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'
import { EventEmitter } from 'events'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import assign from 'object-assign'

const CHANGE_EVENT = 'change'
const MODAL_TYPE_EDIT = 'Edit'
const MODAL_TYPE_NEW = 'New'

const defaultSetting = {
  id: 0,
  target: "021021K1KAm",
  title: "default"
}

const defaultCondition = {
  id: 0,
  settingID: 0,
  feature: "AccelerationX",
  operator: "<",
  value: 10,
  status: "stop"
}

let _store = {
  mIndex: 1,
  sIndex: 1,
  cIndex: 1,
  mlIndex: 1,
  markerLists: [],
  gMap: {},
  settings: [],
  conditions: [],
  invisibleMarkers: [],
  visibleModal: {}
}

function updateMap(gMap) {
  _store.gMap = gMap
}

function addNewMarkers(target, name, markers) {
  const id = getAndCountUp("mlIndex")
  const ml = {
    id: id,
    target: target,
    name: name,
    markers: markers
  }
  _store.markerLists = [..._store.markerLists, ml]
}

function addNewCondition(settingID) {
  const id = getAndCountUp("cIndex")
  const cnd = assign({}, defaultCondition, {id: id, settingID: settingID})
  _store.conditions = [..._store.conditions, cnd]
}

function drawMarkers(name) {
  const markers = _store.invisibleMarkers.filter( m => m.name !== name )
  _store.invisibleMarkers = markers
}

function eraseMarkers(name) {
  const markers = _store.markerLists
                        .find( ml => ml.name === name )
                        .markers
                        .map( m => ({ name: name, id: m.id }) )
  _store.invisibleMarkers = uniqWith([..._store.invisibleMarkers, ...markers], isEqual)
}

function drawMarker(name, id) {
  const markers = _store.invisibleMarkers
                        .filter( m => m.name !== name || m.id !== id )
  _store.invisibleMarkers = markers
}

function eraseMarker(name, id) {
  _store.invisibleMarkers = uniqWith([..._store.invisibleMarkers, { name: name, id: id }], isEqual)
}

function openModal(settingID) {
  const setting = _store.settings.find( s => s.id === settingID )
  setting.modalType = MODAL_TYPE_EDIT
  _store.visibleModal = setting
}

function closeModal() {
  _store.visibleModal = null
}

function newModal() {
  const sid = getAndCountUp("sIndex")
  const st = assign({}, defaultSetting, {modalType: MODAL_TYPE_NEW, id: sid})

  const cid = getAndCountUp("cIndex")
  const cnd = assign({}, defaultCondition, {id: cid, settingID: sid})

  _store.visibleModal = st
  _store.settings = [..._store.settings, st]
  _store.conditions = [..._store.conditions, cnd]
}

function getCount(target) {
  return _store[target]
}

function countUp(target) {
  _store[target]++
}

function getAndCountUp(target) {
  const id = _store[target]
  _store[target] += 1
  return id
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

  getMap() {
    return _store.gMap
  }

  getSettings() {
    return _store.settings
  }

  getMarkers() {
    return _store.markers
  }

  getInvisibles() {
    return _store.invisibleMarkers
  }

  getVisibleModal() {
    return _store.visibleModal
  }

  getConditions() {
    return _store.conditions
  }
}

const MarkerStore = new MarkerStoreClass()

AppDispatcher.register((action) => {

  switch (action.actionType) {
    case MarkerConstants.UPDATE_GOOGLE_MAP:
      updateMap(action.gMap)
      MarkerStore.emitChange()
      break

      // TODO: rename
      /* case MarkerConstants.ADD_NEW_SETTING:
       *   let { target, name, markers } = action
       *   addNewSetting(target, name, markers)
       *   MarkerStore.emitChange()
       *   break
       */
    case MarkerConstants.ADD_NEW_CONDITION:
      addNewCondition(action.settingID)
      MarkerStore.emitChange()
      break

    case MarkerConstants.ADD_NEW_MARKERS:
      const { target, name, markers } = action
      addNewMarkers(target, name, markers)
      MarkerStore.emitChange()
      break

    case MarkerConstants.DRAW_MARKERS:
      drawMarkers(action.name)
      MarkerStore.emitChange()
      break

    case MarkerConstants.ERASE_MARKERS:
      eraseMarkers(action.name)
      MarkerStore.emitChange()
      break

    case MarkerConstants.DRAW_MARKER:
      drawMarker(action.name, action.id)
      MarkerStore.emitChange()
      break

    case MarkerConstants.ERASE_MARKER:
      eraseMarker(action.name, action.id)
      MarkerStore.emitChange()
      break

    case MarkerConstants.OPEN_MODAL:
      openModal(action.id)
      MarkerStore.emitChange()
      break

    case MarkerConstants.CLOSE_MODAL:
      closeModal()
      MarkerStore.emitChange()
      break

    case MarkerConstants.NEW_MODAL:
      newModal()
      MarkerStore.emitChange()
      break

    default:
      return true
  }
})

export default MarkerStore
