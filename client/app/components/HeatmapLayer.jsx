import React from 'react'
import LayerStore from '../stores/LayerStore'
import MarkerStore from '../stores/MarkerStore'
import { createGridPoints } from '../utils/AppGoogleMapUtil'
import { convertMarkersToWeightedLocations } from '../utils/AppAlgorithmUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    isHeatmapVisible: LayerStore.getHeatmapVisibility(),
  }
}

function zoomToRadius(zoom) {
  // TODO: ajust it
  /* let zoomToRadiusMap = {}
   * const radius = zoomToRadiusMap[zoom]
   * return radius ? radius : 200*/
  return 200
}

export default class HeatmapLayer extends React.Component {
  constructor(props) {
    super(props)

    const s = {
      visibleHeatmap: {},
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawHeatmap = this.drawHeatmap.bind(this)
    this.eraseHeatmap = this.eraseHeatmap.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawHeatmap() {
    const { bounds } = this.state
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const markers = MarkerStore.getAllMarkers()
    const wls = convertMarkersToWeightedLocations(markers, gridPoints)
    const radius = zoomToRadius(this.props.gMap.getZoom())
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: wls,
      map: this.props.gMap,
      radius: radius
    })

    this.props.gMap.addListener('bounds_changed', () => {
      const radius = zoomToRadius(this.props.gMap.getZoom())
      this.state.visializeHeatmap.setOptions({ radius: radius })
    })

    this.setState({ visibleHeatmap: heatmap })
  }

  eraseHeatmap() {
    this.state.visibleHeatmap.setMap(null)
    this.setState({ visibleHeatmap: {} })
  }

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange)
  }

  componentDidUpdate(prevProps, prevState) {
    // draw/erase heatmap
    if (!isEqual(this.state.isHeatmapVisible, prevState.isHeatmapVisible)) {
      isEmpty(this.state.visibleHeatmap) ?
      this.drawHeatmap() :
      this.eraseHeatmap()
    }
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <div id="dummyHeatmap"></div>
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
