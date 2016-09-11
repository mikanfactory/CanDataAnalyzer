import React from 'react'
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'

const GoogleMapStyle = {
  position: 'relative',
  float: 'left',
  width: '75%',
  height: '780px'
}

const ToolBoxStyle = {
  position: 'relative',
  float: 'left',
  width: '25%',
  height: '100%'
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Container" style={this.props.style}>
        <GoogleMap style={GoogleMapStyle} />
        <ToolBox style={ToolBoxStyle} />
      </div>
    )
  }
}
