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

    this.findMarkersByName = this.findMarkersByName.bind(this)
  }

  findMarkersByName(name) {
    return this.props.invisibleMarkers
               .filter( marker => marker.name === name )
  }

  render() {
    const markerListNodes = this.props.markerLists.map((ml, i) => {
      return <MarkerList
                 key={i}
                 gMap={this.props.gMap}
                 target={ml.target}
                 name={ml.name}
                 data={ml.markers}
                 invisibleMarkers={this.findMarkersByName(ml.name)} />
    })
    return (
      <div className="AnalysisToolBox" style={ToolBoxStyle}>
        <ToolBoxHeader />
        {markerListNodes}
      </div>
    )
  }
}

AnalysisToolBox.propTypes = {
  gMap: React.PropTypes.object,
  markerLists: React.PropTypes.array,
  invisibleMarkers: React.PropTypes.array
}
