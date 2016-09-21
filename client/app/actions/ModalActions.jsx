import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ModalActions = {
  openModal: (settingID) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.OPEN_MODAL,
      settingID: settingID
    })
  },

  closeModal: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CLOSE_MODAL
    })
  },

  newModal: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.NEW_MODAL
    })
  }
}

export default ModalActions
