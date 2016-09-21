import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ConditionActions = {
  createCondition: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.ADD_NEW_CONDITION,
      settingID: settingID
    })
  },

  updateCondition: (condition) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_CONDITION,
      condtion: condition
    })
  }
}

export default ConditionActions
