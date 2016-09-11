import React from 'react'
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'

const ContainerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
}

const GoogleMapStyle = {
  position: 'relative',
  float: 'left',
  width: '75%',
  height: '770px'
}

const ToolBoxStyle = {
  position: 'relative',
  float: 'left',
  width: '25%',
  height: '770px',
  overflow: 'scroll'
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Container" style={ContainerStyle}>
        <GoogleMap style={GoogleMapStyle} />
        <ToolBox style={ToolBoxStyle} />
      </div>
    )
  }
}
