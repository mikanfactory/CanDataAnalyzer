import React from 'react'
import MarkerActions from '../actions/MarkerActions'

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
    const myLatLng = {lat: -25.363, lng: 131.044}
    const node = this.refs.map

    const map = new window.google.maps.Map(node, {
      zoom: 4,
      center: myLatLng
    })

    MarkerActions.updateGoogleMap(map)
  }

  render() {
    return (
      <div className="GoogleMap" style={GoogleMapStyle} >
        <div style={MapStyle} ref="map">Loading map ...</div>
      </div>
    )
  }
}
