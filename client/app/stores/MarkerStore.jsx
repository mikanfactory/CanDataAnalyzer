import AppDispatcher from '../dispatcher/AppDispatcher'
import MarkerConstants from '../constants/MarkerConstants'
import { EventEmitter } from 'events'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'

const CHANGE_EVENT = 'change'

let _store = {
  gMap: {},
  markerLists: [
    {
      id: 1,
      target: '02121K1KAm',
      name: 'Velocity',
      markers: [...Array(20).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.08, lng: 140.18 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng + i*0.01
          },
          description: (val + 40).toString() + "km/s"
        }
      })
    },
    {
      id: 2,
      target: '02121K1KAm',
      name: 'Acceleration',
      markers: [...Array(10).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.18, lng: 140.28 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng - i*0.01
          },
          description: (val + 10).toString() + "km/s^2"
        }
      })
    },
  ],
  settings: [
    { id: 1, target: "02121K1KAm", title: "Velocity", conditionIDs: [1] },
    { id: 2, target: "02121K1KAm", title: "Acceleration", conditionIDs: [1, 2] }
  ],
  conditions: [
    { id: 1, feature: "Velocity", operator: "<", value: 5.0, status: "stop" },
    { id: 2, feature: "Acceleration Ave", operator: ">", value: 5.0, status: "run" },
  ],
  invisibleMarkers: [],
  visibleModal: {}
}

function updateMap(gMap) {
  _store.gMap = gMap
}

function drawMarkers(name) {
  const markers = _store.invisibleMarkers
                        .filter( m => m.name !== name )
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

function openModal(modalType, settingID) {
  let setting = _store.settings.find( s => s.id === settingID )
  setting.modalType = modalType
  _store.visibleModal = setting
}

function closeModal() {
  _store.visibleModal = null
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
}

const MarkerStore = new MarkerStoreClass()

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case MarkerConstants.UPDATE_GOOGLE_MAP:
      updateMap(action.gMap)
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
      openModal("Edit Config", action.id)
      MarkerStore.emitChange()
      break

    case MarkerConstants.CLOSE_MODAL:
      closeModal()
      MarkerStore.emitChange()
      break

    default:
      return true
  }
})

export default MarkerStore
