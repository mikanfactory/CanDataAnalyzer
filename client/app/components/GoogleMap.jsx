import React from 'react'
import GMapActions from '../actions/GMapActions'
import MarkerActions from '../actions/MarkerActions'
import SettingActions from '../actions/SettingActions'
import { GoogleMapStyle as s } from './Styles'

export default class GoogleMap extends React.Component {
  constructor(props) {
    super(props)

    this.initialized = false
  }

  componentDidMount() {
    const defaultCoordinate = { lat: 36.08912, lng: 140.19674 }
    const node = this.refs.map

    const map = new window.google.maps.Map(node, {
      zoom: 15,
      center: defaultCoordinate,
      disableDoubleClickZoom: true
    })

    map.addListener('idle', () => {
      if (!this.initialized) {
        const markers = JSON.parse(localStorage.getItem('markers'))
        const settings = JSON.parse(localStorage.getItem('settings'))
        SettingActions.createSettings(settings)
        MarkerActions.createMarkers(markers)

        this.initialized = true
      }
    })

    GMapActions.updateGoogleMap(map)
  }

  render() {
    return (
      <div className="GoogleMap" style={s.GoogleMapStyle} >
        <div style={s.MapStyle} ref="map">Loading map ...</div>
      </div>
    )
  }
}
