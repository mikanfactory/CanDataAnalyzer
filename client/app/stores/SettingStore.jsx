import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'
import uniqBy from 'lodash/uniqBy'
import last from 'lodash/last'

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

function _updateSetting(setting) {
  _store.settings = uniqBy([..._store.settings, setting], 'id')
}

function _getAndCountUpId() {
  const sid = _store.currentID
  _store.currentID += 1
  return sid
}

function _removeSetting(sid) {
  _store.settings = _store.settings.filter( s => s.id !== sid )
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

  getAllSettings() {
    return _store.settings
  }

  getSetting(id) {
    return _store.settings.find( s => s.id === id )
  }

  getLatestSetting() {
    return last(_store.settings)
  }

  getLatestID() {
    const s = last(_store.settings)
    return s.id
  }
}

const SettingStore = new SettingStoreClass()

SettingStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.UDPATE_SETTING:
      _updateSetting(action.setting)
      SettingStore.emitChange()
      break

    case ActionTypes.CREATE_MODAL:
      _newSetting()
      SettingStore.emitChange()
      break

    case ActionTypes.CANCEL_MODAL:
      _removeSetting(action.settingID)
      SettingStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default SettingStore