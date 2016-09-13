import React from 'react'
import Marker from './Marker'
import Rodal from 'rodal'

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
      open: true,
      embed: true,
      modal: {
        visible: false
      }
    }

    this.getOpenOrCloseIcon = this.getOpenOrCloseIcon.bind(this)
    this.handleListOpen = this.handleListOpen.bind(this)
    this.handleListClose = this.handleListClose.bind(this)
    this.handleMarkerEmbed = this.handleMarkerEmbed.bind(this)
    this.handleMarkerEject = this.handleMarkerEject.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  handleListOpen() {
    this.setState({ open: true })
  }

  handleListClose() {
    this.setState({ open: false })
  }

  getOpenOrCloseIcon() {
    return this.state.open ?
           <span className="glyphicon glyphicon-triangle-bottom"
                 style={GlyphiconStyle}
                 onClick={this.handleListClose}>
           </span> :
           <span className="glyphicon glyphicon-triangle-top"
                 style={GlyphiconStyle}
                 onClick={this.handleListOpen}>
           </span>
  }

  handleMarkerEmbed() {
    this.setState({ embed: true })
  }

  handleMarkerEject() {
    this.setState({ embed: false })
  }

  getEmbedOrEjectIcon() {
    return this.state.embed ?
           <span className="glyphicon glyphicon-map-marker"
                 style={GlyphiconStyle}
                 onClick={this.handleMarkerEject}>
           </span> :
           <span className="glyphicon glyphicon-map-marker"
                 style={PaledGlyphiconStyle}
                 onClick={this.handleMarkerEmbed}>
           </span>
  }

  handleModalOpen() {
    this.setState({ modal: { visible: true } })
  }

  handleModalClose() {
    this.setState({ modal: { visible: false } })
  }

  render() {
    const markerStyle = this.state.open ? {} : { display: "none" }
    const values = this.props.data.map((marker) => {
      return <Marker key={marker.id}
                     gMap={this.props.gMap}
                     name={marker.id}
                     position={marker.position}
                     style={markerStyle}>
             {marker.value}
            </Marker>
    })

    const openOrCloseIcon = this.getOpenOrCloseIcon()
    const embedOrEjectIcon = this.getEmbedOrEjectIcon()

    return (
      <div className="MarkerList">
        <div className="MarkerListHeader" style={ListHeaderStyle}>
          <span style={StringStyle}>{this.props.children}</span>
          <span className="glyphicon glyphicon-cog"
                style={GlyphiconStyle}
                onClick={this.handleModalOpen}>
          </span>
          {openOrCloseIcon}
          {embedOrEjectIcon}
          <span className="glyphicon glyphicon-trash"
                style={GlyphiconStyle}></span>
        </div>
        <div className="cnt" style={ContainerStyle}>{values}</div>
        <Rodal visible={this.state.modal.visible}
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
  children: React.PropTypes.string,
}
