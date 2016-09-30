import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const MessageActions = {
  createMessage: msg => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_MESSAGE,
      msg: msg
    })
  },

  deleteMessage: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DELETE_MESSAGE
    })
  }
}

export default MessageActions
