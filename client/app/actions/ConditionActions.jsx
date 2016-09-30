import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const ConditionActions = {
  updateCondition: condition => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_CONDITION,
      condition: condition
    })
  }
}

export default ConditionActions
