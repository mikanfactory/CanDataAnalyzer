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
      marker: { object: null, open: false },
      infoWindow: { object: null, open: false },
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMountMarker = this.handleMountMarker.bind(this)
    this.handleToggleInfoWindow = this.handleToggleInfoWindow.bind(this)
    this.handleToggleMarker = this.handleToggleMarker.bind(this)
    this.handleCloseInfoWindow = this.handleCloseInfoWindow.bind(this)
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleToggleInfoWindow() {
    this.state.infoWindow.open ?
    this.state.infoWindow.object.close() :
    this.state.infoWindow.object.open(
      this.state.gMap,
      this.state.marker.object
    )

    this.setState({ infoWindow: {
      object: this.state.infoWindow.object,
      open: !this.state.infoWindow.open
    }})
  }

  handleToggleMarker() {
    this.state.marker.open ?
    this.state.marker.object.setMap(null) :
    this.state.marker.object.setMap(this.state.gMap)

    this.setState({ marker: {
      object: this.state.marker.object,
      open: !this.state.marker.open
    }})
  }

  handleCloseInfoWindow() {
    this.state.infoWindow.object.close()
    this.setState({ infoWindow: {
      object: this.state.infoWindow.object,
      open: false
    }})
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

    this.setState({ marker: { object: marker, open: true } })
    this.setState({ infoWindow: { object: infoWindow, open: true } })
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
