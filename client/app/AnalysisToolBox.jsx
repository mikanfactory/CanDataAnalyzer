import React from 'react'
import ATBHeader from './ATBHeader'
import MarkerList from './MarkerList'
import Immutable from 'immutable'

const markerLists = {
  'Velocity': Immutable.Range(10, 100).toArray().map((val) => {
    return val.toString() + "km"
  }),
  'Acceleration': Immutable.Range(0, 10).toArray().map((val) => {
    return val.toString() + "km/s"
  }),
  'SuddenStop': Immutable.Range(40, 60).toArray().map((val) => {
    return val.toString() + "km/s"
  })
}

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const markerListNodes = Object.keys(markerLists).map((key) => {
      return <MarkerList data={markerLists[key]}>{key}</MarkerList>
    })
    return (
      <div className="AnalysisToolBox" style={this.props.style}>
        <ATBHeader />
        {markerListNodes}
      </div>
    )
  }
}
