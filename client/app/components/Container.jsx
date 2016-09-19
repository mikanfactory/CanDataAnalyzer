import React from 'react'
import isEmpty from 'lodash/isEmpty'
import Modal from "./Modal"
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'
import MarkerStore from '../stores/MarkerStore'

const ContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

const EmptyModal = {
  id: 0,
  target: "",
  title: "",
  conditionIDs: []
}

function getMarkerState() {
  return {
    gMap:             MarkerStore.getMap(),
    markerLists:      MarkerStore.getMarkerLists(),
    invisibleMarkers: MarkerStore.getInvisibles(),
    visibleModal:     MarkerStore.getVisibleModal(),
    conditions:       MarkerStore.getConditions()
  }
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = getMarkerState()

    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    MarkerStore.addChangeListener(this._onChange)

    // Because this function runs after GoogleMap#ComponentDidMount,
    // rerender and pass gMap to child component.
    this.setState(getMarkerState())
  }

  componentWillUnmount() {
    MarkerStore.removeChangeListener(this._onChange)
  }

  render() {
    const modal = !isEmpty(this.state.visibleModal) ?
                  this.state.visibleModal :
                  EmptyModal

    return (
      <div className="Container" style={ContainerStyle}>
        <GoogleMap gMap={this.state.gMap} />
        <ToolBox gMap={this.state.gMap}
                 markerLists={this.state.markerLists}
                 invisibleMarkers={this.state.invisibleMarkers} />
        <Modal isVisible={!isEmpty(this.state.visibleModal)}
               conditions={this.state.conditions}
               {...modal} />
      </div>
    )
  }

  _onChange() {
    this.setState(getMarkerState())
  }
}
