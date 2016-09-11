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
      hover: false
    }

    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }

  handleMouseOver() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }

  handleRemove() {
    const key = this.props.name
    const value = this.props.children
    this.props.onRemoveMarker({ key: key, value: value })
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
            <span className="glyphicon glyphicon-remove"
                  style={glyphiconStyle}
                  onClick={this.handleRemove}>
            </span>
      </div>
    )
  }
}
