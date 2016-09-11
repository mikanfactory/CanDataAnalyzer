import React from 'react'

const HeaderStyle = {
  color: "#FFF",
  backgroundColor: "#00BCD4",
  fontSize: "24px",
  fontWeight: "200",
  lineHeight: "64px",
  paddingLeft: "20px",
  paddingRight: "10px",
  textAlign: "right"
}

const StringStyle = {
  float: "left"
}

const GlyphiconStyle = {
  fontSize: "smaller",
  padding: "0 10px"
}

export default class ATBHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="ATBHeader" style={HeaderStyle}>
        <span style={StringStyle}>CanDataAnalyzer</span>
        <span className="glyphicon glyphicon-plus" style={GlyphiconStyle}></span>
        <span className="glyphicon glyphicon-film" style={GlyphiconStyle}></span>
      </div>
    )
  }
}