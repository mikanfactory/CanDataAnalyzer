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
    const { gMap, settings, markers, invisibleMarkers } = this.props
    const markerListNodes = settings.map( st => {
      const ms = markers.filter( m => m.settingID === st.id )
      const invs = invisibleMarkers.filter( m => m.settingID === st.id )
      return <MarkerList
                 key={st.id}
                 gMap={gMap}
                 markers={ms}
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
