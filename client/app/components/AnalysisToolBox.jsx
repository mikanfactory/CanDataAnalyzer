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
    const markerListNodes = this.props.settings.map( st => {
      const markers = this.props.markers.filter( m => m.settingID === st.id )
      const invs = this.props.invisibleMarkers.filter( marker => marker.name === name )
      return <MarkerList
                 key={st.id}
                 gMap={this.props.gMap}
                 markers={markers}
                 {...st}
                 invisibleMarkers={invs} />
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
  markers: React.PropTypes.array,
  settings: React.PropTypes.array,
  invisibleMarkers: React.PropTypes.array
}
