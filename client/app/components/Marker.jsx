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
const PaledGlyphiconStyle = Object.assign({}, HoveredMarkerStyle, { color: "#8B8B8B" })

export default class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false,
      display: true,
      gMap: null,
      marker: null,
      markerVisible: false,
      infoWindow: null,
      infoWindowVisible: false,
    }

    this.getMarkerStyle = this.getMarkerStyle.bind(this)
    this.getGlyphiconStyle = this.getGlyphiconStyle.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMarkerMount = this.handleMarkerMount.bind(this)
    this.handleMarkerToggle = this.handleMarkerToggle.bind(this)
    this.handleInfoWindowToggle = this.handleInfoWindowToggle.bind(this)
  }

  getMarkerStyle() {
    const style = this.state.hover ? HoveredMarkerStyle : MarkerStyle
    return Object.assign({}, style, this.props.style)
  }

  getGlyphiconStyle() {
    switch (true) {
      case this.state.hover && this.state.markerVisible:
        return HoveredGlyphiconStyle
      case this.state.hover && !this.state.markerVisible:
        return PaledGlyphiconStyle
      case !this.state.hover && this.state.markerVisible:
        return GlyphiconStyle
      case !this.state.hover && !this.state.markerVisible:
        return Object.assign({}, PaledGlyphiconStyle, { backgroundColor: "#FFF" })
    }
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleInfoWindowToggle() {
    this.state.infoWindowVisible ?
    this.state.infoWindow.close() :
    this.state.infoWindow.open(this.state.gMap, this.state.marker)

    this.setState({ infoWindowVisible: !this.state.infoWindowVisible })
  }

  handleMarkerToggle() {
    this.state.markerVisible ?
    this.state.marker.setMap(null) :
    this.state.marker.setMap(this.state.gMap)

    this.setState({ markerVisible: !this.state.markerVisible })
  }

  handleMarkerMount(nextProps) {
    const marker = new window.google.maps.Marker({
      position: this.props.position,
      title: this.props.children,
    })

    const infoWindow = new window.google.maps.InfoWindow({
      content: this.props.children
    })

    marker.addListener('click', () => {
      this.handleInfoWindowToggle()
    })

    this.setState({ marker: marker, markerVisible: true })
    this.setState({ infoWindow: infoWindow, infoWindowVisible: true })
    marker.setMap(nextProps.gMap)
  }

  componentWillReceiveProps(nextProps) {
    // if marker has not rendered
    if (!this.state.marker) {
      this.setState({ gMap: nextProps.gMap })
      return this.handleMarkerMount(nextProps)
    }

    this.setState({ display: !this.state.display })
  }

  render() {
    const markerStyle = this.getMarkerStyle()
    const glyphiconStyle = Object.assign({}, this.getGlyphiconStyle(), this.props.style)

    return (
      <div className="Marker"
           style={markerStyle}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
            <span style={StringStyle}>{this.props.children}</span>
            <span className="glyphicon glyphicon-map-marker"
                  style={glyphiconStyle}
                  onClick={this.handleMarkerToggle}>
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
