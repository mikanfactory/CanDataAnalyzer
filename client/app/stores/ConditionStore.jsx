import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
import assign from 'object-assign'
import uniqBy from 'lodash/uniqBy'

import { defaultCondition } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  conditions: []
}

function _updateCondition(condition) {
  _store.conditions = uniqBy([..._store.conditions, condition], 'id')
}

function _createConditions(sid) {
  const cid = _getAndCountUpId()
  const condition = assign({}, defaultCondition, {id: cid, settingID: sid})
  _store.conditions = [..._store.conditions, condition]
}

function _getAndCountUpId() {
  const cid = _store.currentID
  _store.currentID += 1
  return cid
}

function _removeCondition(id) {
  _store.conditions = _store.conditions.filter( c => c.id !== id )
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

  getConditions(sid) {
    return _store.conditions.filter( c => c.settingID === sid )
  }
}

const ConditionStore = new ConditionStoreClass()

ConditionStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.UPDATE_CONDITION:
      _updateCondition(action.condition)
      break

    case ActionTypes.CREATE_MODAL:
      _createConditions(action.sid)
      ConditionStore.emitChange()
      break

    case ActionTypes.CANCEL_MODAL:
      _removeCondition(action.id)
      ConditionStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default ConditionStore
