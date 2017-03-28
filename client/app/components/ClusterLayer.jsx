import React from 'react'
import LayerStore from '../stores/LayerStore'
import { createGridPoints, createColoredRectangles } from '../utils/AppGoogleMapUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    assignedClusters: LayerStore.getAssignedClusters(),
    clusterName: LayerStore.getClusterName()
  }
}

export default class ClusterLayer extends React.Component {
  constructor(props) {
    super(props)

    const s = {
      visibleClusters: [],
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawClusters = this.drawClusters.bind(this)
    this.eraseClusters = this.eraseClusters.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawClusters() {
    const { bounds, assignedClusters, clusterName } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const clusters = createColoredRectangles(gMap, gridPoints, assignedClusters, clusterName)

    this.setState({ visibleClusters: clusters })
  }

  eraseClusters() {
    this.state.visibleClusters.forEach( row => row.map( g => g.setMap(null) ) )
    this.setState({ visibleClusters: [] })
  }

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange)
  }

  componentDidUpdate(prevProps, prevState) {
    // draw/erase cluster
    if (!isEqual(this.state.assignedClusters, prevState.assignedClusters)) {
      isEmpty(this.state.visibleClusters) ?
      this.drawClusters() :
      this.eraseClusters()
    }
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <div id="dummyCluster"></div>
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

ClusterLayer.propTypes = {
  gMap: React.PropTypes.object
}
