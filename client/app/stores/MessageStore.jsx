import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'
import { EventEmitter } from 'events'
const ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'

let _store = {
  message: {}
}

function _create_message(message) {
  _store.message = message
}

function _destroy_message() {
  _store.message = {}
}

class MessageStoreClass extends EventEmitter {
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
    this.removeChangeListener(CHANGE_EVENT, callback)
  }

  getMessage() {
    return _store.message
  }
}

const MessageStore = new MessageStoreClass

MessageStore.dispatchToken = AppDispatcher.register((actions) => {
  switch (actions.actionType) {
    case ActionTypes.CREATE_MESSAGE:
      _create_message(actions.msg)
      MessageStore.emitChange()
      break

    case ActionTypes.DESTROY_MESSAGE:
      _destroy_message()
      MessageStore.emitChange()
      break

    default:
      // do nothing
  }
})

export default MessageStore
