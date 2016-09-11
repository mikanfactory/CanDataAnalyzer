import React from 'react'
import ATBHeader from './ATBHeader'
import MarkerList from './MarkerList'

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'Velocity': [...Array(20).keys()].map((val) => {
        return { key: val, value: (val + 40).toString() + "km/s"}
      }),
      'Acceleration': [...Array(10).keys()].map((val) => {
        return { key: val, value: (val + 10).toString() + "km/s^2"}
      }),
      'SuddenStop': [...Array(20).keys()].map((val) => {
        return { key: val, value: "-" + (val + 10).toString() + "km/s^2"}
      })
    }

    this.handleRemoveMarker = this.handleRemoveMarker.bind(this)
  }

  handleRemoveMarker(markerExt) {
    const {target, key} = markerExt
    const oldTarget = this.state[target]
    const newTarget = oldTarget.filter((kv) => { return kv.key !== key })
    this.setState({ 'Velocity': newTarget }) // for testing
  }

  render() {
    const markerListNodes = Object.keys(this.state).map((key) => {
      return <MarkerList
                 key={key}
                 data={this.state[key]}
                 onRemoveMarker={this.handleRemoveMarker}>
               {key}
             </MarkerList>
    })
    return (
      <div className="AnalysisToolBox" style={this.props.style}>
        <ATBHeader />
        {markerListNodes}
      </div>
    )
  }
}
