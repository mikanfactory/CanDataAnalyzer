import React from 'react'
import GMapActions from '../actions/GMapActions'

const GoogleMapStyle = {
  position: 'relative',
  float: 'left',
  width: '75%',
  height: '770px'
}

const MapStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

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
      <div className="GoogleMap" style={GoogleMapStyle} >
        <div style={MapStyle} ref="map">Loading map ...</div>
      </div>
    )
  }
}
