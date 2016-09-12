import React from 'react'

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
    let myLatLng = {lat: -25.363, lng: 131.044}
    let node = this.refs.map

    let map = new window.google.maps.Map(node, {
      zoom: 4,
      center: myLatLng
    })
  }

  render() {
    return (
      <div className="GoogleMap" style={GoogleMapStyle} >
        <div style={MapStyle} ref="map">Loading map ...</div>
      </div>
    )
  }
}
