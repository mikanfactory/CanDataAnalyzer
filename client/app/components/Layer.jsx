import React from 'react'
import LayerStore from '../stores/LayerStore'
import MarkerStore from '../stores/MarkerStore'
import LayerAction from '../actions/LayerActions'
import {
  createRectangle, createRectangles,
  createGridPoints, createColoredRectangles
} from '../utils/AppGoogleMapUtil'
import { convertMarkersToWeightedLocations } from '../utils/AppAlgorithmUtil'
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
    assignedClusters: LayerStore.getAssignedClusters()
  }
}

function zoomToRadius(zoom) {
  let zoomToRadiusMap = {
    13: 80,
    14: 100,
    15: 120,
    16: 150,
    17: 300,
    18: 400,
    19: 800,
    20: 1200
  }

  const radius = zoomToRadiusMap[zoom]
  return radius ? radius : 100
}

export default class Layer extends React.Component {
  constructor(props) {
    super(props)

    const s = {
      visibleGridPoints: [],
      visibleRectangle: {},
      visibleHeatmap: {},
      visibleClusters: []
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
      this.state.visibleHeatmap.setOptions({ radius: radius })
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
      isEmpty(this.state.assignedClusters) ?
      this.drawClusters() :
      this.eraseClusters()
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
