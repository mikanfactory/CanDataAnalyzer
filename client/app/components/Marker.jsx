import React from 'react'
import MarkerActions from '../actions/MarkerActions'

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

    this._isMarkerInitiallyRenderd = false

    this.state = {
      hover: false,
      marker: null,
      infoWindow: null,
      isWindowPoped: false,
    }

    this.getTitle = this.getTitle.bind(this)
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

  getTitle() {
    const { index, position } = this.props
    return `id: ${index}, lat: ${position.lat.toFixed(3)}, lng: ${position.lng.toFixed(3)}`
  }

  getMarkerStyle() {
    const style = this.state.hover ? HoveredMarkerStyle : MarkerStyle
    const extension = this.props.isDisplayed ? {} : { display: "none" }
    return Object.assign({}, style, extension)
  }

  getGlyphiconStyle() {
    switch (true) {
      case this.state.hover && this.props.isMarkerDrawed:
        return HoveredGlyphiconStyle
      case this.state.hover && !this.props.isMarkerDrawed:
        return PaledGlyphiconStyle
      case !this.state.hover && this.props.isMarkerDrawed:
        return GlyphiconStyle
      case !this.state.hover && !this.props.isMarkerDrawed:
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
    const { index, target } = this.props
    this.props.isMarkerDrawed ?
      MarkerActions.eraseMarker(target, index) :
      MarkerActions.drawMarker(target, index)
  }

  handleInfoWindowToggle() {
    this.setState({ isWindowPoped: !this.state.isWindowPoped })
  }

  handleNewMarkerMount() {
    const marker = new window.google.maps.Marker({
      position: this.props.position,
      title: this.getTitle(),
      icon: this.props.image
    })

    const infoWindow = new window.google.maps.InfoWindow({
      content: this.props.description
    })

    marker.addListener('click', () => {
      this.handleInfoWindowToggle()
    })

    this.setState({
      marker: marker,
      infoWindow: infoWindow,
      isWindowPoped: false
    })
  }

  handleMarkerMount() {
    this.state.marker.setMap(this.props.gMap)
  }

  handleMarkerUnmount() {
    this.state.marker.setMap(null)
    this.state.infoWindow.close()
  }

  handleWindowOpen() {
    this.state.infoWindow.open(this.state.gMap, this.state.marker)
  }

  handleWindowClose() {
    this.state.infoWindow.close()
  }

  componentWillReceiveProps(nextProps) {
    // if google maps marker has not rendered
    if (!this._isMarkerInitiallyRenderd) {
      this.handleNewMarkerMount(nextProps)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if google maps marker has not rendered
    if (!this._isMarkerInitiallyRenderd) {
      this.handleMarkerMount()
      this._isMarkerInitiallyRenderd = true
      return
    }

    // Click marker toggle button in MarkerList
    if (this.props.isMarkerDrawed !== prevProps.isMarkerDrawed) {
      this.props.isMarkerDrawed ? this.handleMarkerMount() : this.handleMarkerUnmount()
    }

    // Click infoWindow toggle buttons
    if (this.state.isWindowPoped !== prevState.isWindowPoped) {
      this.state.isWindowPoped ? this.handleWindowOpen() : this.handleWindowClose()
    }
  }

  render() {
    const markerStyle = this.getMarkerStyle()
    const glyphiconStyle = this.getGlyphiconStyle()

    return (
      <div className="Marker"
           style={markerStyle}
           onClick={this.handleInfoWindowToggle}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
            <span style={StringStyle}>{this.getTitle()}</span>
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
  index: React.PropTypes.number,
  target: React.PropTypes.string,
  image: React.PropTypes.string,
  position: React.PropTypes.object,
  description: React.PropTypes.string,
  isDisplayed: React.PropTypes.bool,
  isMarkerDrawed: React.PropTypes.bool
}
