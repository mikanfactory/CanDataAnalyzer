import React from 'react'
import LayerStore from '../stores/LayerStore'
import MarkerStore from '../stores/MarkerStore'
import LayerAction from '../actions/LayerActions'
import {
  createRectangle, createRectangles,
  createGridPoints, createColoredRectangles
} from '../utils/AppGoogleMapUtil'
import {
  convertMarkersToWeightedLocations,
  createRiskHeatmap
} from '../utils/AppAlgorithmUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    isGridLayerVisible: LayerStore.getGridLayerVisibility(),
    isRectangleVisible: LayerStore.getRectangleVisibility(),
    isHeatmapVisible: LayerStore.getHeatmapVisibility(),
    assignedClusters: LayerStore.getAssignedClusters(),
    assignedRisks: LayerStore.getAssignedRisks()
  }
}

function zoomToRadius(zoom) {
  // TODO: ajust it
  /* let zoomToRadiusMap = {}
   * const radius = zoomToRadiusMap[zoom]
   * return radius ? radius : 200*/
  return 200
}

export default class Layer extends React.Component {
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

  drawRectangle() {
    const { bounds } = this.state
    const rectangle = createRectangle(this.props.gMap, bounds)

    rectangle.addListener('dblclick', () => {
      const newBounds = rectangle.getBounds()
      LayerAction.changeRectToGrid(newBounds)
    })

    rectangle.addListener('bounds_changed', () => {
      const newBounds = rectangle.getBounds()
      LayerAction.updateBounds(newBounds)
    })

    this.setState({ visibleRectangle: rectangle })
  }

  eraseRectangle() {
    this.state.visibleRectangle.setMap(null)
    this.setState({ visibleRectangle: {} })
  }

  drawGridLayer() {
    const { bounds } = this.state
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const rectangles = createRectangles(this.props.gMap, gridPoints)

    rectangles.forEach( row => row.map( g => {
      g.addListener('dblclick', () => {
        LayerAction.changeGridToRect(bounds)
      })
    }))

    this.setState({ visibleGridPoints: rectangles })
  }

  eraseGridLayer() {
    this.state.visibleGridPoints.forEach( row => row.map( g => g.setMap(null) ) )
    this.setState({ visibleGridPoints: [] })
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

  drawClusters() {
    const { bounds, assignedClusters } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const clusters = createColoredRectangles(gMap, gridPoints, assignedClusters)

    this.setState({ visibleClusters: clusters })
  }

  eraseClusters() {
    this.state.visibleClusters.forEach( row => row.map( g => g.setMap(null) ) )
    this.setState({ visibleClusters: [] })
  }

  drawRiskLayer() {
    const { bounds, assignedRisks } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const wls = createRiskHeatmap(gMap, gridPoints, assignedRisks)
    const radius = 30
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: wls,
      map: this.props.gMap,
      radius: radius
    })

    const rectangles = createRectangles(this.props.gMap, gridPoints)

    rectangles.forEach( row => row.map( g => {
      g.addListener('dblclick', () => {
        LayerAction.changeGridToRect(bounds)
      })
    }))

    this.setState({ visibleGridPoints: rectangles })
    this.setState({ visibleRisks: heatmap })
  }

  eraseRiskLayer() {
    this.state.visibleRisks.setMap(null)
    this.setState({ visibleRisks: {} })
  }

  drawIndexMarker() {
    const {}
  }

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange)
  }

  componentDidUpdate(prevProps, prevState) {
    // draw/erase grid layer
    if (!isEqual(this.state.isGridLayerVisible, prevState.isGridLayerVisible)) {
      isEmpty(this.state.visibleGridPoints) ?
      this.drawGridLayer() :
      this.eraseGridLayer()
    }

    // draw/erase rectangle
    if (!isEqual(this.state.isRectangleVisible, prevState.isRectangleVisible)) {
      isEmpty(this.state.visibleRectangle) ?
      this.drawRectangle() :
      this.eraseRectangle()
    }

    // draw/erase heatmap
    if (!isEqual(this.state.isHeatmapVisible, prevState.isHeatmapVisible)) {
      isEmpty(this.state.visibleHeatmap) ?
      this.drawHeatmap() :
      this.eraseHeatmap()
    }

    if (!isEqual(this.state.assignedClusters, prevState.assignedClusters)) {
      isEmpty(this.state.visibleClusters) ?
      this.drawClusters() :
      this.eraseClusters()
    }

    if (!isEqual(this.state.assignedRisks, prevState.assignedRisks)) {
      isEmpty(this.state.visibleRisks) ?
      this.drawRiskLayer() :
      this.eraseRiskLayer()
    }
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <div id="dummyMap"></div>
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
