import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events'
import MarkerConstants from '../constants/MarkerConstants';

const CHANGE_EVENT = 'change'

// Define the store as an empty array
let _store = {
  map: {},
  markerLists: [
    {
      name: 'Velocity',
      markers: [...Array(20).keys()].map((val) => {
        return {id: val, value: (val + 40).toString() + "km/s"}
      })
    },
    {
      name: 'Acceleration',
      markers: [...Array(10).keys()].map((val) => {
        return { id: val, value: (val + 10).toString() + "km/s^2" }
      })
    },
    {
      name: 'SuddenStop',
      markers: [...Array(20).keys()].map((val) => {
        return { id: val, value: (val + 40).toString() + "km/s" }
      })
    },
  ]
};

function updateMap(map) {
  _store.map = map
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
    return _store.map
  }

  getMarkerLists() {
    return _store.markerLists
  }
}

const MarkerStore = new MarkerStoreClass();

AppDispatcher.register((action) => {
  switch (action.actionType) {
    case MarkerConstants.UPDATE_GOOGLE_MAP:
      updateMap(action.map)
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
