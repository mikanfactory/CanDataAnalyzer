import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import SettingStore from '../constants/SettingStore'
import { EventEmitter } from 'events'

const ActionTypes = AppConstants.ActionTypes
const ModalTypes = AppConstants.ModalTypes
const CHANGE_EVENT = 'change'

let _store = {
  visibleModal: {}
}

function _createModal() {
  const setting = SettingStore.getLatestSetting()
  _store.visibleModal = { modalType: ModalTypes.NEW, settingID: setting.id }
}

function _openModal(sid) {
  _store.visibleModal = { modalType: ModalTypes.EDIT, settingID: sid }
}

function _closeModal() {
  _store.visibleModal = null
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
    return _store.visibleModal
  }
}

const ModalStore = new ModalStoreClass()

ModalStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
      // TODO: do it after create new setting
    case ActionTypes.CREATE_MODAL:
      _createModal()
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

      // TODO: do it after remove setting and conditions
    case ActionTypes.CANCEL_MODAL:
      _closeModal()
      ModalStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default ModalStore
