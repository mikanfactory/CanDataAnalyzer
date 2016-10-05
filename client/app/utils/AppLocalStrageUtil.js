import MarkerStore from '../stores/MarkerStore'
import SettingStore from '../stores/SettingStore'
import MessageActions from '../actions/MessageActions'
import SettingActions from '../actions/SettingActions'
import MarkerActions from '../actions/MarkerActions'


export function saveToLocalStorage(message = true) {
  localStorage.clear()
  const markers = MarkerStore.getAllMarkers()
  const settings = SettingStore.getAllSettings()
  localStorage.setItem('markers', JSON.stringify(markers))
  localStorage.setItem('settings', JSON.stringify(settings))

  if (message) {
    MessageActions.createMessage({ text: "Save configs to LocalStorage!!!!!" })
  }
}

export function loadLocalStorage() {
  const markers = JSON.parse(localStorage.getItem('markers'))
  const settings = JSON.parse(localStorage.getItem('settings'))
  SettingActions.createSettings(settings)
  MarkerActions.createMarkers(markers)
}
