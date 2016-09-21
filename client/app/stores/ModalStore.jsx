import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'

import { defaultSetting, defaultCondition } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const ModalTypes = AppConstants.ModalTypes
const CHANGE_EVENT = 'change'

let _store = {
  visibleModal: {}
}

function _openModal(sid) {
  const setting = _store.settings.find( s => s.id === sid )
  setting.modalType = ModalTypes.EDIT
  _store.visibleModal = setting
}

function _closeModal() {
  _store.visibleModal = null
}

function _newModal() {
  const sid = getAndCountUp("sIndex")
  const st = assign({}, defaultSetting, {modalType: ModalTypes.NEW, id: sid})

  const cid = getAndCountUp("cIndex")
  const cnd = assign({}, defaultCondition, {id: cid, settingID: sid})

  _store.visibleModal = st
  _store.settings = [..._store.settings, st]
  _store.conditions = [..._store.conditions, cnd]
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
    case ActionTypes.OPEN_MODAL:
      _openModal(action.settingID)
      ModalStore.emitChange()
      break

    case ActionTypes.CLOSE_MODAL:
      _closeModal()
      ModalStore.emitChange()
      break

    case ActionTypes.NEW_MODAL:
      _newModal()
      ModalStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default ModalStore
