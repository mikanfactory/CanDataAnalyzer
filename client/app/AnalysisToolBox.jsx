import React from 'react'
import ATBHeader from './ATBHeader'
import MarkerList from './MarkerList'

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="AnalysisToolBox" style={this.props.style}>
        <ATBHeader />
        <MarkerList />
      </div>
    )
  }
}
