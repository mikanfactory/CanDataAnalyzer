import React from 'react'
import Marker from './Marker'

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
      embed: true
    }

    this.handleOpenList = this.handleOpenList.bind(this)
    this.handleCloseList = this.handleCloseList.bind(this)
    this.getOpenOrCloseIcon = this.getOpenOrCloseIcon.bind(this)

    this.handleEmbedMarker = this.handleEmbedMarker.bind(this)
    this.handleEjectMarker = this.handleEjectMarker.bind(this)

    this.handleRemoveMarker = this.handleRemoveMarker.bind(this)
    this.handleRemoveMarkers = this.handleRemoveMarkers.bind(this)
  }

  handleOpenList() {
    this.setState({ open: true })
  }

  handleCloseList() {
    this.setState({ open: false })
  }

  getOpenOrCloseIcon() {
    return this.state.open ?
           <span className="glyphicon glyphicon-triangle-bottom"
                 style={GlyphiconStyle}
                 onClick={this.handleCloseList}>
           </span> :
           <span className="glyphicon glyphicon-triangle-top"
                 style={GlyphiconStyle}
                 onClick={this.handleOpenList}>
           </span>
  }

  handleEmbedMarker() {
    this.setState({ embed: true })
  }

  handleEjectMarker() {
    this.setState({ embed: false })
  }

  getEmbedOrEjectIcon() {
    return this.state.embed ?
           <span className="glyphicon glyphicon-map-marker"
                 style={GlyphiconStyle}
                 onClick={this.handleEjectMarker}>
           </span> :
           <span className="glyphicon glyphicon-map-marker"
                 style={PaledGlyphiconStyle}
                 onClick={this.handleEmbedMarker}>
           </span>
  }

  handleRemoveMarker(marker) {
    const markerExt = Object.assign({}, marker, { name: this.props.children })
    this.props.onRemoveMarker(markerExt)
  }

  handleRemoveMarkers() {
    this.props.onRemoveMarkers(this.props.children)
  }

  render() {
    console.log(this.props)
    const values = this.props.data.map((marker) => {
      return <Marker
                 key={marker.id}
                 name={marker.id}
                 onRemoveMarker={this.handleRemoveMarker}>
             {marker.value}
            </Marker>
    })

    const openOrCloseIcon = this.getOpenOrCloseIcon()
    const embedOrEjectIcon = this.getEmbedOrEjectIcon()

    return (
      <div className="MarkerList">
        <div className="MarkerListHeader" style={ListHeaderStyle}>
          <span style={StringStyle}>{this.props.children}</span>
          <span className="glyphicon glyphicon-cog" style={GlyphiconStyle}></span>
          {openOrCloseIcon}
          {embedOrEjectIcon}
          <span className="glyphicon glyphicon-trash"
                onClick={this.handleRemoveMarkers}
                style={GlyphiconStyle}></span>
        </div>
        <div className="cnt" style={ContainerStyle}>{values}</div>
      </div>
    )
  }
}

MarkerList.propTypes = {
  data: React.PropTypes.array,
  children: React.PropTypes.string,
  onRemoveMarker: React.PropTypes.func,
  onRemoveMarkers: React.PropTypes.func,
}
