import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'
import { EventEmitter } from 'events'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import uniqueId from 'lodash/uniqueId'

const CHANGE_EVENT = 'change'
const MODAL_TYPE_EDIT = 'Edit'
const MODAL_TYPE_NEW = 'New'

let _store = {
  gMap: {},
  nextSettingID: 3,
  markerLists: [
    {
      id: 1,
      target: '021021K1KAm',
      name: 'Velocity',
      markers: [...Array(20).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.08, lng: 140.18 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng + i*0.01
          },
          image: "./static/icon/green_car.png",
          description: (val + 40).toString() + "km/s"
        }
      })
    },
    {
      id: 2,
      target: '021021K1KAm',
      name: 'Acceleration',
      markers: [...Array(10).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.18, lng: 140.28 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng - i*0.01
          },
          image: "./static/icon/green_car.png",
          description: (val + 10).toString() + "km/s^2"
        }
      })
    },
  ],
  settings: [
    { id: 1, target: "021021K1KAm", title: "Velocity Setting" },
    { id: 2, target: "021021K1KAm", title: "Acceleration Setting" }
  ],
  conditions: [
    { id: 1, settingID: 1, feature: "AccelerationX", operator: "<", value: 10.0, status: "stop" },
    { id: 2, settingID: 1, feature: "AccelerationX", operator: "<", value: 30.0, status: "green" },
    { id: 3, settingID: 1, feature: "AccelerationX", operator: "<", value: 60.0, status: "yellow" },
    { id: 4, settingID: 2, feature: "BrakeOnOff", operator: ">", value: 5.0, status: "stop" },
  ],
  invisibleMarkers: [],
  visibleModal: {}
}

function updateMap(gMap) {
  _store.gMap = gMap
}

function addNewMarkers(target, name, markers) {
  const id = getCount()
  const ml = {
    id: id,
    target: target,
    name: name,
    markers: markers
  }

  _store.markerLists = [..._store.markerLists, ml]
}

function addNewSetting() {
  const id = uniqueId()
  const st = {
    id: id,
    target: "",
    title: ""
  }

  _store.settings = [..._store.settings, st]
}

function addNewCondition(settingID) {
  const id = uniqueId()
  const cnd = {
    id: id,
    settingID: settingID,
    feature: "",
    operator: "",
    value: 0,
    status: "",
  }
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
  const id = _store.nextSettingID
  const emptySetting = {
    modalType: MODAL_TYPE_NEW,
    id: id,
    target: "",
    title: "",
    conditionIDs: []
  }
  _store.visibleModal = emptySetting
}

function getCount() {
  return _store.nextSettingID
}

function countUp() {
  _store.nextSettingID++
  return _store.nextSettingID
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

  getMarkerLists() {
    return _store.markerLists
  }

  getMarkerList(name) {
    return _store.markerLists.find( mlist => mlist.name === name )
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

    case MarkerConstants.ADD_NEW_SETTING:
      addNewSetting()
      MarkerStore.emitChange()
      break

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
      addNewSetting()
      MarkerStore.emitChange()
      break

    default:
      return true
  }
})

export default MarkerStore
