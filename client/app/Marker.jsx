import React from 'react'
import Immutable from 'immutable'

const MarkerStyle = {
  color: "#1F1F1F",
  backgroundColor: "#FFF",
  fontSize: "18px",
  fontWeight: "200",
  lineHeight: "46px",
}

const StringStyle = {
  paddingLeft: "20px"
}

const HoveredMarkerStyle = Object.assign({}, MarkerStyle, {backgroundColor: "#E8E8E8"})

export default class Marker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hover: false
    }

    this.mouseOver = this.mouseOver.bind(this)
    this.mouseOut = this.mouseOut.bind(this)
  }

  mouseOver() {
    this.setState({ hover: true })
  }

  mouseOut() {
    this.setState({ hover: false })
  }

  render() {
    let markerStyle = this.state.hover ? HoveredMarkerStyle : MarkerStyle

    return (
      <div className="Marker"
           style={markerStyle}
           onMouseOver={this.mouseOver}
           onMouseOut={this.mouseOut}>
        <span style={StringStyle}>{this.props.children}</span>
      </div>
    )
  }
}
