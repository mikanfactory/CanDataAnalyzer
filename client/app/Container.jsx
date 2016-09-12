import React from 'react'
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'

const ContainerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Container" style={ContainerStyle}>
        <GoogleMap />
        <ToolBox />
      </div>
    )
  }
}
