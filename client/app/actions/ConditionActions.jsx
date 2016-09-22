import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ConditionActions = {
  createCondition: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_CONDITION,
      settingID: settingID
    })
  },

  updateCondition: condition => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_CONDITION,
      condtion: condition
    })
  },

  removeCondition: id => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.REMOVE_CONDITION,
      id: id
    })
  }
}

export default ConditionActions
