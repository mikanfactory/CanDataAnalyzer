import React from 'react'
import LayerStore from '../stores/LayerStore'
import LayerAction from '../actions/LayerActions'
import {createRectangle, createRectangles, createGridPoints } from '../utils/AppGoogleMapUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    isGridLayerVisible: LayerStore.getGridLayerVisibility(),
    isRectangleVisible: LayerStore.getRectangleVisibility(),
  }
}

export default class GridLayer extends React.Component {
  constructor(props) {
    const s = {
      visibleGridPoints: [],
      visibleRectangle: {},
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawGridLayer = this.drawGridLayer.bind(this)
    this.eraseGridLayer = this.eraseGridLayer.bind(this)
    this.drawRectangle = this.drawRectangle.bind(this)
    this.eraseRectangle = this.eraseRectangle.bind(this)
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
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <div id="dummyGridLayer"></div>
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

GridLayer.propTypes = {
  gMap: React.PropTypes.object
}
