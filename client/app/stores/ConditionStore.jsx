import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import SettingStore from '../stores/SettingStore'
import { EventEmitter } from 'events'
import assign from 'object-assign'
import uniqBy from 'lodash/uniqBy'
import sortBy from 'lodash/sortBy'

import { defaultCondition } from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  currentID: 1,
  conditions: [],
}

function _updateCondition(condition) {
  const cnds = uniqBy([condition, ..._store.conditions], 'id')
  _store.conditions = sortBy(cnds, 'id')
}

function _createCondition(sid) {
  const cid = _getAndCountUpId()
  const condition = assign({}, defaultCondition, { id: cid, settingID: sid })
  _store.conditions = [..._store.conditions, condition]
}

function _getAndCountUpId() {
  const cid = _store.currentID
  _store.currentID += 1
  return cid
}

function _removeCondition(sid) {
  _store.conditions = _store.conditions.filter( c => c.settingID !== sid )
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

  getCondition(sid) {
    return _store.conditions.find( c => c.settingID === sid )
  }
}

const ConditionStore = new ConditionStoreClass()

ConditionStore.dispatchToken = AppDispatcher.register((action) => {

  switch (action.actionType) {
    case ActionTypes.UPDATE_CONDITION:
      _updateCondition(action.condition)
      ConditionStore.emitChange()
      break

    case ActionTypes.CREATE_MODAL:
      AppDispatcher.waitFor([SettingStore.dispatchToken])
      _createCondition(SettingStore.getLatestID())
      ConditionStore.emitChange()
      break

    case ActionTypes.CANCEL_MODAL:
      _removeCondition(action.settingID)
      ConditionStore.emitChange()
      break

    default:
      // do nothing
  }

})

export default ConditionStore
