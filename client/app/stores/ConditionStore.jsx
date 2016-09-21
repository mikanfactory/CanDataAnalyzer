import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'

import { defaultCondition } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  conditions: []
}

function _newCondition(sid) {
  const cid = _getAndCountUpId()
  const condition = assign({}, defaultCondition, {id: cid, settingID: sid})
  _store.conditions = [..._store.conditions, condition]
}

function _getAndCountUpId() {
  const cid = _store.currentID
  _store.currentID += 1
  return cid
}

class ConditionStoreClass extends EventEmitter {
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

  getConditions() {
    return _store.markers
  }
}

const ConditionStore = new ConditionStoreClass()

ConditionStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.NEW_MODAL:
      _newCondition(action.sid)
      ConditionStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default ConditionStore
