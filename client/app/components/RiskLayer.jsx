import React from 'react'
import LayerStore from '../stores/LayerStore'
import LayerAction from '../actions/LayerActions'
import { createGridPoints, createColoredRectangles } from '../utils/AppGoogleMapUtil'
import { convertMarkersToWeightedLocations } from '../utils/AppAlgorithmUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    assignedRisks: LayerStore.getAssignedRisks()
  }
}

export default class RiskLayer extends React.Component {
  constructor(props) {
    super(props)

    const s = {
      visibleRisks: [],
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawRiskLayer = this.drawRiskLayer.bind(this)
    this.eraseRiskLayer = this.eraseRiskLayer.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawRiskLayer() {
    const { bounds, assignedRisks } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const risks = createColoredRectangles(gMap, gridPoints, assignedRisks)

    this.setState({ visibleRisks: risks })
  }

  eraseRiskLayer() {
    this.state.visibleRisks.setMap(null)
    this.setState({ visibleRisks: [] })
  }

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange)
  }

  componentDidUpdate(prevProps, prevState) {
    // draw/erase heatmap
    if (!isEqual(this.state.assignedRisks, prevState.assignedRisks)) {
      isEmpty(this.state.visibleRisks) ?
      this.drawRiskLayer() :
      this.eraseRiskLayer()
    }
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <div id="dummyRiskLayer"></div>
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

RiskLayer.propTypes = {
  gMap: React.PropTypes.object
}
