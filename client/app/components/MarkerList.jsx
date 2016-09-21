import React from 'react'
import Marker from './Marker'
import MarkerStore from '../stores/MarkerStore'
import MarkerActions from '../actions/MarkerActions'
import ModalActions from '../actions/ModalActions'
import assign from 'object-assign'

const ListHeaderStyle = {
  color: "#1B1B1B",
  backgroundColor: "#CCCCCC",
  fontWeight: "200",
  lineHeight: "46px",
  paddingLeft: "20px",
  paddingRight: "10px",
  textAlign: "right"
}

const StringStyle = {
  fontSize: "18px",
  float: "left"
}

const GlyphiconStyle = { padding: "0 10px" }
const PaledGlyphiconStyle = assign({}, GlyphiconStyle, { color: "#8B8B8B" })
const ContainerStyle = { padding: "0" }

function getStateFromStores(sid) {
  return {
    markers: MarkerStore.getMarkers(sid),
    invisibleMarkers: MarkerStore.getInvisibles(sid)
  }
}

function isMarkerDrawed(id, invs) {
  const marker = invs.find(marker => marker.id === id)
  return !marker
}

export default class MarkerList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isListOpened: true,
      drawAllMarkers: true,
    }

    this.getMarker = this.getMarker.bind(this)
    this.getOpenOrCloseIcon = this.getOpenOrCloseIcon.bind(this)
    this.getDrawOrEraseIcon = this.getDrawOrEraseIcon.bind(this)
    this.handleListOpen = this.handleListOpen.bind(this)
    this.handleListClose = this.handleListClose.bind(this)
    this.handleMarkerDraw = this.handleMarkerDraw.bind(this)
    this.handleMarkerErase = this.handleMarkerErase.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
  }

  getOpenOrCloseIcon() {
    return this.state.isListOpened ?
           <span className="glyphicon glyphicon-triangle-bottom"
                 style={GlyphiconStyle}
                 onClick={this.handleListClose}>
           </span> :
           <span className="glyphicon glyphicon-triangle-top"
                 style={GlyphiconStyle}
                 onClick={this.handleListOpen}>
           </span>
  }

  getDrawOrEraseIcon() {
    return this.state.drawAllMarkers ?
           <span className="glyphicon glyphicon-map-marker"
                 style={GlyphiconStyle}
                 onClick={this.handleMarkerErase}>
           </span> :
           <span className="glyphicon glyphicon-map-marker"
                 style={PaledGlyphiconStyle}
                 onClick={this.handleMarkerDraw}>
           </span>
  }

  getMarker(marker) {
    return (
      <Marker key={marker.id} gMap={this.props.gMap} {...marker}
              isDisplayed={this.state.isListOpened}
              isMarkerDrawed={isMarkerDrawed(marker.id, this.state.invisibleMarkers)} />
    )
  }

  handleListOpen() {
    this.setState({ isListOpened: true })
  }

  handleListClose() {
    this.setState({ isListOpened: false })
  }

  handleMarkerDraw() {
    this.setState({ drawAllMarkers: true })
    MarkerActions.drawMarkers(this.props.title)
  }

  handleMarkerErase() {
    this.setState({ drawAllMarkers: false })
    MarkerActions.eraseMarkers(this.props.title)
  }

  handleModalOpen() {
    ModalActions.openModal(this.props.id)
  }

  componentDidMount() {
    MarkerStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    MarkerStore.removeChangeListener(this._onChange);
  }

  render() {
    const markerNodes = this.state.markers.map(this.getMarker)
    const openOrCloseIcon = this.getOpenOrCloseIcon()
    const drawOrEraseIcon = this.getDrawOrEraseIcon()

    return (
      <div className="MarkerList">
        <div className="MarkerListHeader" style={ListHeaderStyle}>
          <span style={StringStyle}>{this.props.title}</span>
          <span className="glyphicon glyphicon-cog"
                style={GlyphiconStyle}
                onClick={this.handleModalOpen} >
          </span>
          {openOrCloseIcon}
          {drawOrEraseIcon}
          <span className="glyphicon glyphicon-trash"
                style={GlyphiconStyle}></span>
        </div>
        <div className="cnt" style={ContainerStyle}>{markerNodes}</div>
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores(this.props.id));
  }
}

MarkerList.propTypes = {
  gMap: React.PropTypes.object,
  id: React.PropTypes.number,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
}
