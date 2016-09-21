import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'
import last from 'lodash/last'
import include from 'lodash/include'

import { defaultSetting } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  settings: []
}

function _newSetting() {
  const sid = _getAndCountUpId()
  const setting = assign({}, defaultSetting, { id: sid })
  _store.settings = [..._store.settings, setting]
}

function _getAndCountUpId() {
  const sid = _store.currentID
  _store.currentID += 1
  return sid
}

function _removeSetting(ids) {
  _store.settings = _store.settings.filter( s => !include(ids, s.id) )
}

class SettingStoreClass extends EventEmitter {
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

  getSetting(id) {
    return _store.settings.find( s => s.id === id )
  }

  getLatestSetting() {
    return last(_store.settings)
  }
}

const SettingStore = new SettingStoreClass()

SettingStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.CREATE_MODAL:
      _newSetting()
      SettingStore.emitChange()
      break

    case ActionTypes.CANCEL_MODAL:
      _removeSetting(action.ids)
      SettingStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default SettingStore
