import React from 'react'
import MarkerActions from '../actions/MarkerActions'
import { MarkerStyle as s } from './Styles'

export default class Marker extends React.Component {
  constructor(props) {
    super(props)

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
    const { id, position } = this.props
    return `id: ${id}, lat: ${position.lat.toFixed(3)}, lng: ${position.lng.toFixed(3)}`
  }

  getMarkerStyle() {
    const style = this.state.hover ? s.HoveredMarkerStyle : s.MarkerStyle
    const extension = this.props.isDisplayed ? {} : { display: "none" }
    return Object.assign({}, style, extension)
  }

  getGlyphiconStyle() {
    switch (true) {
      case this.state.hover && this.props.isMarkerDrawed:
        return s.HoveredGlyphiconStyle
      case this.state.hover && !this.props.isMarkerDrawed:
        return s.PaledGlyphiconStyle
      case !this.state.hover && this.props.isMarkerDrawed:
        return s.GlyphiconStyle
      case !this.state.hover && !this.props.isMarkerDrawed:
        return s.InvisibleMarkerStyle
    }
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleMarkerToggle() {
    const { id, settingID } = this.props
    this.props.isMarkerDrawed ?
      MarkerActions.eraseMarker(id, settingID) :
      MarkerActions.drawMarker(id, settingID)
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

    marker.setMap(this.props.gMap)
  }

  handleMarkerMount() {
    this.state.marker.setMap(this.props.gMap)
  }

  handleMarkerUnmount() {
    this.state.marker.setMap(null)
    this.state.infoWindow.close()
  }

  handleWindowOpen() {
    this.state.infoWindow.open(this.props.gMap, this.state.marker)
  }

  handleWindowClose() {
    this.state.infoWindow.close()
  }

  componentDidMount() {
    this.handleNewMarkerMount()
  }

  componentDidUpdate(prevProps, prevState) {
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
            <span style={s.StringStyle}>{this.getTitle()}</span>
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
  id: React.PropTypes.number,
  settingID: React.PropTypes.number,
  image: React.PropTypes.string,
  position: React.PropTypes.object,
  description: React.PropTypes.string,
  isDisplayed: React.PropTypes.bool,
  isMarkerDrawed: React.PropTypes.bool
}
