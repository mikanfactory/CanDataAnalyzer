import React from 'react'
import GMapActions from '../actions/GMapActions'
import { GoogleMapStyle as s } from './Styles'

export default class GoogleMap extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const defaultCoordinate = { lat: 36.18, lng: 140.28 }
    const node = this.refs.map

    const map = new window.google.maps.Map(node, {
      zoom: 10,
      center: defaultCoordinate
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
