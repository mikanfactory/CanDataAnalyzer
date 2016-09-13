import React from 'react'
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'
import MarkerStore from '../stores/MarkerStore'

const ContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

function getMarkerState() {
  return {
    gMap: MarkerStore.getMap(),
    markerLists: MarkerStore.getMarkerLists()
  }
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = getMarkerState()

    this._onChange = this._onChange.bind(this)

    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
  }

  componentDidMount() {
    MarkerStore.addChangeListener(this._onChange)
    this.setState(getMarkerState()) // Because this function runs after emitting
  }

  componentWillUnmount() {
    MarkerStore.removeChangeListener(this._onChange)
  }

  render() {
    return (
      <div className="Container" style={ContainerStyle}>
        <GoogleMap gMap={this.state.gMap} />
        <ToolBox gMap={this.state.gMap}
                 markerLists={this.state.markerLists} />
      </div>
    )
  }

  _onChange() {
    this.setState(getMarkerState())
  }
}
