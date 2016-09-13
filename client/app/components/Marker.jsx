import React from 'react'

const MarkerStyle = {
  color: "#1F1F1F",
  backgroundColor: "#FFF",
  fontWeight: "200",
  lineHeight: "46px",
  paddingLeft: "20px",
  paddingRight: "10px",
  textAlign: "right"
}

const StringStyle = {
  float: "left",
  fontSize: "18px"
}

const GlyphiconStyle = {
  padding: "0 10px",
  visibility: "hidden"
}

const HoveredMarkerStyle = Object.assign({}, MarkerStyle, { backgroundColor: "#E8E8E8" })
const HoveredGlyphiconStyle = Object.assign({}, GlyphiconStyle, { visibility: "visible" })

export default class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      gMap: null,
      marker: null,
      markerVisible: false,
      infoWindow: null,
      infoWindowVisible: false,
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMountMarker = this.handleMountMarker.bind(this)
    this.handleToggleInfoWindow = this.handleToggleInfoWindow.bind(this)
    this.handleToggleMarker = this.handleToggleMarker.bind(this)
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleToggleInfoWindow() {
    this.state.infoWindowVisible ?
    this.state.infoWindow.close() :
    this.state.infoWindow.open(this.state.gMap, this.state.marker)

    this.setState({ infoWindowVisible: !this.state.infoWindowVisible })
  }

  handleToggleMarker() {
    this.state.markerVisible ?
    this.state.marker.setMap(null) :
    this.state.marker.setMap(this.state.gMap)

    this.setState({ markerVisible: !this.state.markerVisible })
  }

  handleMountMarker(nextProps) {
    const marker = new window.google.maps.Marker({
      position: this.props.position,
      title: this.props.children,
    })

    const infoWindow = new window.google.maps.InfoWindow({
      content: this.props.children
    })

    marker.addListener('click', () => {
      this.handleToggleInfoWindow()
    })

    this.setState({ marker: marker, markerVisible: true })
    this.setState({ infoWindow: infoWindow, infoWindowVisible: true })
    marker.setMap(nextProps.gMap)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.gMap) return
    this.handleMountMarker(nextProps)
    this.setState({ gMap: nextProps.gMap })
  }

  render() {
    const markerStyle = this.state.hover ? HoveredMarkerStyle : MarkerStyle
    const glyphiconStyle = this.state.hover ? HoveredGlyphiconStyle : GlyphiconStyle

    return (
      <div className="Marker"
           style={markerStyle}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
            <span style={StringStyle}>{this.props.children}</span>
            <span className="glyphicon glyphicon-map-marker"
                  style={glyphiconStyle}
                  onClick={this.handleToggleMarker}>
            </span>
      </div>
    )
  }
}

Marker.propTypes = {
  gMap: React.PropTypes.object,
  name: React.PropTypes.number,
  position: React.PropTypes.object,
  children: React.PropTypes.string
}
