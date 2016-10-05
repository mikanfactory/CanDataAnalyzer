import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

const ActionTypes = AppConstants.ActionTypes

const SettingActions = {
  createSettings: settings => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.CREATE_SETTINGS,
      settings: settings
    })
  },

  updateSetting: setting => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.UPDATE_SETTING,
      setting: setting
    })
  },

  destroySetting: settingID => {
    AppDispatcher.dispatch({
      actionType: ActionTypes.DESTROY_SETTING,
      settingID: settingID
    })
  }
}

export default SettingActions
