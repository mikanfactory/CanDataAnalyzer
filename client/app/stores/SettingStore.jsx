import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'
import last from 'lodash/last'
import isEmpty from 'lodash/isEmpty'

import { defaultSetting } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  settings: []
}

function _createSettings(settings) {
  // if initize setting and setting === undefined || []
  if (isEmpty(settings)) {
    _store.settings = []
    return
  }

  const lastSetting = last(settings)
  _store.settings = settings
  _store.currentID = lastSetting.id + 1
}

function _createDefaultSetting() {
  const sid = _getAndCountUpId()
  const setting = assign({}, defaultSetting, { id: sid })
  _store.settings = [..._store.settings, setting]
}

function _createCustomSetting(setting) {
  _store.settings = [..._store.settings, setting]
}

function _updateSetting(setting) {
  const stgs = uniqBy([setting, ..._store.settings], 'id')
  _store.settings = sortBy(stgs, 'id')
}

function _destroySetting(id) {
  _store.settings = _store.settings.filter( s => s.id !== id)
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
    return s ? s.id : 0
  }
}

const SettingStore = new SettingStoreClass()

SettingStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    // for initializing
    case ActionTypes.CREATE_SETTINGS:
      _createSettings(action.settings)
      SettingStore.emitChange()
      break

    case ActionTypes.CREATE_SETTING:
      _createCustomSetting(action.setting)
      SettingStore.emitChange()
      break

    case ActionTypes.UPDATE_SETTING:
      _updateSetting(action.setting)
      SettingStore.emitChange()
      break

    case ActionTypes.DESTROY_SETTING:
      _destroySetting(action.settingID)
      SettingStore.emitChange()
      break

    case ActionTypes.CREATE_MODAL:
      _createDefaultSetting()
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
