import React from 'react'
import Marker from './Marker'

const ListStyle = {
  color: "#1B1B1B",
  backgroundColor: "#CCCCCC",
  fontSize: "18px",
  fontWeight: "200",
  lineHeight: "46px",
}

const StringStyle = {
  paddingLeft: "20px"
}

export default class MarkerList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let velocities = this.props.data.map((velocity) => {
      return <Marker>{velocity}</Marker>
    })

    return (
      <div className="MarkerList" style={ListStyle}>
        <span style={StringStyle}>{this.props.children}</span>
        {velocities}
      </div>
    )
  }
}
