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
    this.state = {
      markerLists: [
        {
          name: 'Velocity',
          markers: [...Array(20).keys()].map((val) => {
            return { id: val, value: (val + 40).toString() + "km/s" }
          })
        },
        {
          name: 'Acceleration',
          markers: [...Array(10).keys()].map((val) => {
            return { id: val, value: (val + 10).toString() + "km/s^2" }
          })
        },
        {
          name: 'SuddenStop',
          markers: [...Array(20).keys()].map((val) => {
            return { id: val, value: (val + 40).toString() + "km/s" }
          })
        },
      ]
    }

    this.handleRemoveMarker = this.handleRemoveMarker.bind(this)
    this.handleRemoveMarkers = this.handleRemoveMarkers.bind(this)
  }

  handleRemoveMarker(markerExt) {
    const {name, id} = markerExt
    const oldLists = this.state.markerLists
    const newMarkers = oldLists
      .find(lst => lst.name === name)
      .markers
      .filter(marker => marker.id !== id)

    const newLists = oldLists.map(mlist => {
      return mlist.name !== name ? mlist : { name: name, markers: newMarkers }
    })

    this.setState({ markerLists: newLists })
  }

  handleRemoveMarkers(name) {
    const newLists = this.state.markerLists.filter(mlist => {
      return mlist.name !== name
    })

    this.setState({ markerLists: newLists})
  }

  render() {
    const markerListNodes = this.state.markerLists.map((mlst, i) => {
      return <MarkerList
                 key={i}
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
