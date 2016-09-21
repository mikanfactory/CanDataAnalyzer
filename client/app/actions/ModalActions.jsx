import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ModalActions = {
  createModal: () => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_MODAL
    })
  },

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
  }
}

export default ModalActions
