import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const SettingActions = {
  addNewSetting: (target, settingID, markers) => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.ADD_NEW_SETTING,
      target: target,
      settingID: settingID,
      markers: markers
    })
  },

}

export default SettingActions
