import React from 'react'
import Rodal from 'rodal'

const HeaderStyle = {
  color: "#FFF",
  backgroundColor: "#00BCD4",
  fontWeight: "200",
  lineHeight: "64px",
  paddingLeft: "20px",
  paddingRight: "10px",
  textAlign: "right"
}

const StringStyle = {
  float: "left",
  fontSize: "24px"
}

const GlyphiconStyle = { padding: "0 10px" }

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={HeaderStyle}>
          <span style={StringStyle}>CanDataAnalyzer</span>
          <span className="glyphicon glyphicon-plus"
                style={GlyphiconStyle}
                onClick={this.handleModalOpen}>
          </span>
          <span className="glyphicon glyphicon-film"
                style={GlyphiconStyle}
                onClick={this.handleModalOpen}>
          </span>
        </div>
      </div>
    )
  }
}
