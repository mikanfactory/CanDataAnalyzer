import React from 'react'
import ToolBoxHeader from './ToolBoxHeader'
import MarkerList from './MarkerList'

const ToolBoxStyle = {
  position: 'relative',
  float: 'left',
  width: '25%',
  height: '770px',
  overflow: 'scroll'
}

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const markerListNodes = this.props.markerLists.map((mlst, i) => {
      return <MarkerList
                 key={i}
                 gMap={this.props.gMap}
                 data={mlst.markers}>
               {mlst.name}
             </MarkerList>
    })
    return (
      <div className="AnalysisToolBox" style={ToolBoxStyle}>
        <ToolBoxHeader />
        {markerListNodes}
      </div>
    )
  }
}
