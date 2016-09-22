import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import SettingStore from '../stores/SettingStore'
import ConditionStore from '../stores/ConditionStore'
import { EventEmitter } from 'events'

const ActionTypes = AppConstants.ActionTypes
const ModalTypes = AppConstants.ModalTypes
const CHANGE_EVENT = 'change'

let _store = {
  modal: {}
}

function _createModal(settingID) {
  _store.modal = { modalType: ModalTypes.NEW, settingID: settingID }
}

function _openModal(sid) {
  _store.modal = { modalType: ModalTypes.EDIT, settingID: sid }
}

function _closeModal() {
  _store.modal = { modalType: "", settingID: 0 }
}

class ModalStoreClass extends EventEmitter {
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

  getVisibleModal() {
    return _store.modal
  }
}

const ModalStore = new ModalStoreClass()

ModalStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.CREATE_MODAL:
      AppDispatcher.waitFor([SettingStore.dispatchToken, ConditionStore.dispatchToken])
      _createModal(SettingStore.getLatestID())
      ModalStore.emitChange()
      break

    case ActionTypes.OPEN_MODAL:
      _openModal(action.settingID)
      ModalStore.emitChange()
      break

    case ActionTypes.CLOSE_MODAL:
      _closeModal()
      ModalStore.emitChange()
      break

    case ActionTypes.CANCEL_MODAL:
      AppDispatcher.waitFor([SettingStore.dispatchToken, ConditionStore.dispatchToken])
      _closeModal()
      ModalStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default ModalStore
