import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events'
import MarkerConstants from '../constants/MarkerConstants';

const CHANGE_EVENT = 'change'

// Define the store as an empty array
let _store = {
  gMap: {},
  markerLists: [
    {
      name: 'Velocity',
      markers: [...Array(20).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.08, lng: 140.18 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng + i*0.01
          },
          value: (val + 40).toString() + "km/s"
        }
      })
    },
    {
      name: 'Acceleration',
      markers: [...Array(10).keys()].map((val, i) => {
        const defaultPosition = { lat: 36.18, lng: 140.28 }
        return {
          id: val,
          position: {
            lat: defaultPosition.lat + i*0.01,
            lng: defaultPosition.lng - i*0.01
          },
          value: (val + 10).toString() + "km/s^2"
        }
      })
    },
  ]
};

function updateMap(gMap) {
  _store.gMap = gMap
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
    return _store.markerLists.find( mlist => mlist.name === name)
  }
}

const MarkerStore = new MarkerStoreClass();

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case MarkerConstants.UPDATE_GOOGLE_MAP:
      updateMap(action.gMap)
      MarkerStore.emitChange()
      break

    case MarkerConstants.NEW_ITEM:
      /* MarkerStore.emit(CHANGE_EVENT);*/
      break;

    case MarkerConstants.SAVE_ITEM:
      /* MarkerStore.emit(CHANGE_EVENT);*/
      break;

    case MarkerConstants.REMOVE_ITEM:
      /* MarkerStore.emit(CHANGE_EVENT);*/
      break;

    case MarkerConstants.GET_RANDOM_RESPONSE:
      /* MarkerStore.emit(CHANGE_EVENT);*/
      break;

    default:
      return true;
  }
});

export default MarkerStore;
