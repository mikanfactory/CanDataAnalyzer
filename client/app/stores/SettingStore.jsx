import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'

import { defaultSetting } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const ModalTypes = AppConstants.ModalTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  settings: []
}

function _newSetting() {
  const sid = _getAndCountUpId()
  const setting = assign({}, defaultSetting, {modalType: ModalTypes.NEW, id: sid})
  _store.settings = [..._store.settings, setting]
}

function _getAndCountUpId() {
  const sid = _store.currentID
  _store.currentID += 1
  return sid
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

  getSettings() {
    return _store.markers
  }
}

const SettingStore = new SettingStoreClass()

SettingStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.NEW_MODAL:
      _newSetting()
      SettingStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default SettingStore
