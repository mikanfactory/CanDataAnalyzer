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

    this.handleRemoveMarker = this.handleRemoveMarker.bind(this)
    this.handleRemoveMarkers = this.handleRemoveMarkers.bind(this)
  }

  handleRemoveMarker(markerExt) {
  }

  handleRemoveMarkers(name) {
  }

  render() {
    const markerListNodes = this.props.markerLists.map((mlst, i) => {
      return <MarkerList
                 key={i}
                 gMap={this.props.gMap}
                 data={mlst.markers}
                 onRemoveMarker={this.handleRemoveMarker}
                 onRemoveMarkers={this.handleRemoveMarkers}>
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
