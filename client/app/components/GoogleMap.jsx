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
      center: defaultCoordinate,
      disableDoubleClickZoom: true
    })

    const edge = {
      lat: defaultCoordinate.lat + 0.1,
      lng: defaultCoordinate.lng - 0.1
    }
    const originalPoints = [...Array(10).keys()].map(i => [...Array(10).keys()])
    const gridPoints = originalPoints.map( (row, i) =>
      row.map( j => ({
        north: edge.lat - 0.001*i,
        south: edge.lat - 0.001*(i+1),
        east:  edge.lng + 0.001*(j+1),
        west:  edge.lng + 0.001*j
      }))
    )

    gridPoints.map( row =>
      row.map( coord => {
        new window.google.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          bounds: coord,
        })
      })
    )

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

/* GoogleMap.propTypes = {
 *   gMap: React.PropTypes.Object
 * }*/
