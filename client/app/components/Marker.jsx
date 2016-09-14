import React from 'react'
import isEmpty from 'lodash/isEmpty'

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
      gMap: null,
      hover: false,
      marker: null,
      isMarkerDrawed: false,
      infoWindow: null,
      isWindowPoped: false,
    }

    this.getMarkerStyle = this.getMarkerStyle.bind(this)
    this.getGlyphiconStyle = this.getGlyphiconStyle.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleNewMarkerMount = this.handleNewMarkerMount.bind(this)
    this.handleMarkerToggle = this.handleMarkerToggle.bind(this)
    this.handleInfoWindowToggle = this.handleInfoWindowToggle.bind(this)
    this.handleMarkerMount = this.handleMarkerMount.bind(this)
    this.handleMarkerUnmount = this.handleMarkerUnmount.bind(this)
  }

  getMarkerStyle() {
    const style = this.state.hover ? HoveredMarkerStyle : MarkerStyle
    const extension = this.props.isDisplayed ? {} : { display: "none" }
    return Object.assign({}, style, extension)
  }

  getGlyphiconStyle() {
    switch (true) {
      case this.state.hover && this.state.isMarkerDrawed:
        return HoveredGlyphiconStyle
      case this.state.hover && !this.state.isMarkerDrawed:
        return PaledGlyphiconStyle
      case !this.state.hover && this.state.isMarkerDrawed:
        return GlyphiconStyle
      case !this.state.hover && !this.state.isMarkerDrawed:
        return Object.assign({}, PaledGlyphiconStyle, { backgroundColor: "#FFF" })
    }
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleMarkerToggle() {
    this.setState({ isMarkerDrawed: !this.state.isMarkerDrawed })
  }

  handleInfoWindowToggle() {
    this.setState({ isWindowPoped: !this.state.isWindowPoped })
  }

  handleNewMarkerMount(nextProps) {
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

    this.setState({
      marker: marker,
      isMarkerDrawed: true,
      infoWindow: infoWindow,
      isWindowPoped: false
    })

    marker.setMap(nextProps.gMap)
  }

  handleMarkerMount() {
    this.state.marker.setMap(this.state.gMap)
  }

  handleMarkerUnmount() {
    this.state.marker.setMap(null)
    this.state.infoWindow.close()
  }

  componentWillReceiveProps(nextProps) {
    // if google maps marker has not rendered
    if (!this.state.marker) {
      this.setState({ gMap: nextProps.gMap })
      this.handleNewMarkerMount(nextProps)
      return
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Click marker toggle button in Marker
    if (this.state.isMarkerDrawed !== prevState.isMarkerDrawed) {
      this.state.isMarkerDrawed ? this.handleMarkerUnmount() : this.handleMarkerMount()
    }

    // Click marker toggle button in MarkerList
    if (this.props.isMarkersDrawed !== prevProps.isMarkersDrawed) {
      this.props.isMarkersDrawed ? this.handleMarkerMount() : this.handleMarkerUnmount()
    }
  }

  render() {
    const markerStyle = this.getMarkerStyle()
    const glyphiconStyle = this.getGlyphiconStyle()

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
