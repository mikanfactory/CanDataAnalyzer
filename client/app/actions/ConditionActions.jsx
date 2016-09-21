import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ConditionActions = {
  addNewCondition: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.ADD_NEW_CONDITION,
      settingID: settingID
    })
  },
}

export default ConditionActions
