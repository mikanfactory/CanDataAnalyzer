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
      visibleGridPoints: [],
      visibleRectangle: {},
      visibleHeatmap: {},
      visibleClusters: [],
      visibleRisks: {},
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawGridLayer = this.drawGridLayer.bind(this)
    this.eraseGridLayer = this.eraseGridLayer.bind(this)
    this.drawRectangle = this.drawRectangle.bind(this)
    this.eraseRectangle = this.eraseRectangle.bind(this)
    this.drawHeatmap = this.drawHeatmap.bind(this)
    this.eraseHeatmap = this.eraseHeatmap.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawRiskLayer() {
    const { bounds, assignedRisks } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const rs = assignedRisks.map( (val) => {
      switch (true) {
        case val == 0:
          return 0
        case val < 0.5:
          return 4
        case val < 1.0:
          return 3
        case val < 1.4:
          return 2
        default:
          return 1
      }
    })
    /* const rs = assignedRisks.map( (val) => val )*/

    const risks = createColoredRectangles(gMap, gridPoints, rs)
    this.setState({ visibleRisks: risks })
  }

  eraseRiskLayer() {
    this.state.visibleRisks.setMap(null)
    this.setState({ visibleRisks: {} })
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

Layer.propTypes = {
  gMap: React.PropTypes.object
}
