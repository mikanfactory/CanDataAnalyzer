import React from 'react'
import Marker from './Marker'
import Rodal from 'rodal'
import MarkerActions from '../actions/MarkerActions'

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
const PaledGlyphiconStyle = Object.assign({}, GlyphiconStyle, { color: "#8B8B8B" })
const ContainerStyle = { padding: "0" }

export default class MarkerList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isListOpened: true,
      drawAllMarkers: true,
      isModalAppeared: false
    }

    this.getOpenOrCloseIcon = this.getOpenOrCloseIcon.bind(this)
    this.getDrawOrEraseIcon = this.getDrawOrEraseIcon.bind(this)
    this.isMarkerDrawed = this.isMarkerDrawed.bind(this)
    this.handleListOpen = this.handleListOpen.bind(this)
    this.handleListClose = this.handleListClose.bind(this)
    this.handleMarkerDraw = this.handleMarkerDraw.bind(this)
    this.handleMarkerErase = this.handleMarkerErase.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
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

  isMarkerDrawed(id) {
    const marker = this.props.invisibleMarkers
                       .find(marker => marker.id === id)
    return !marker
  }

  handleListOpen() {
    this.setState({ isListOpened: true })
  }

  handleListClose() {
    this.setState({ isListOpened: false })
  }

  handleMarkerDraw() {
    this.setState({ drawAllMarkers: true })
    MarkerActions.drawMarkers(this.props.name)
  }

  handleMarkerErase() {
    this.setState({ drawAllMarkers: false })
    MarkerActions.eraseMarkers(this.props.name)
  }

  handleModalOpen() {
    this.setState({ isModalAppeared: true })
  }

  handleModalClose() {
    this.setState({ isModalAppeared: false })
  }

  render() {
    const markerNodes = this.props.data.map((marker) => {
      return <Marker key={marker.id}
                     gMap={this.props.gMap}
                     mid={marker.id}
                     name={this.props.name}
                     title={marker.value}
                     position={marker.position}
                     isDisplayed={this.state.isListOpened}
                     isMarkerDrawed={this.isMarkerDrawed(marker.id)} />
    })

    const openOrCloseIcon = this.getOpenOrCloseIcon()
    const drawOrEraseIcon = this.getDrawOrEraseIcon()

    return (
      <div className="MarkerList">
        <div className="MarkerListHeader" style={ListHeaderStyle}>
          <span style={StringStyle}>{this.props.name}</span>
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
        <Rodal visible={this.state.isModalAppeared}
               width={800}
               height={480}
               onClose={this.handleModalClose}>
          <div className="ModalHeader">Rodal</div>
          <div className="ModalBody">A react modal with animations</div>
          <button className="rodal-comfirm-btn" onClick={this.handleModalClose}>OK</button>
          <button className="rodal-cancel-btn" onClick={this.handleModalClose}>Cancel</button>
        </Rodal>
      </div>
    )
  }
}

MarkerList.propTypes = {
  gMap: React.PropTypes.object,
  data: React.PropTypes.array,
  name: React.PropTypes.string, // it denote name
  invisibleMarkers: React.PropTypes.array
}
