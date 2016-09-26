import React from 'react'
import LayerStore from '../stores/LayerStore'
import LayerAction from '../actions/LayerActions'
import { createRectangle, createRectangles, createGridPoints } from '../utils/AppGoogleMapUtil'
import { defaultDivideSize } from '../constants/AppConstants'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    gridPoints: LayerStore.getGridPoints(),
    divideSize: LayerStore.getDivideSize(),
    rectangleBounds: LayerStore.getRectangleBounds()
  }
}

export default class Layer extends React.Component {
  constructor(props) {
    super(props)

    const s = {
      visibleGridPoints: [],
      visibleRectangle: {}
    }
    this.state = assign({}, getStateFromStores(), s)

    this.drawGridLayer = this.drawGridLayer.bind(this)
    this.eraseGridLayer = this.eraseGridLayer.bind(this)
    this.drawRectangle = this.drawRectangle.bind(this)
    this.eraseRectangle = this.eraseRectangle.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawRectangle() {
    const { rectangleBounds } = this.state
    const rectangle = createRectangle(this.props.gMap, rectangleBounds)

    rectangle.addListener('dblclick', () => {
      const gridPoints = createGridPoints(this.props.gMap, defaultDivideSize)
      LayerAction.changeRectToGrid(gridPoints)
    })

    this.setState({ visibleRectangle: rectangle })
  }

  eraseRectangle() {
    this.state.visibleRectangle.setMap(null)
    this.setState({ visibleRectangle: {} })
  }

  drawGridLayer() {
    const { gridPoints } = this.state
    const rectangles = createRectangles(this.props.gMap, gridPoints)

    rectangles.forEach( row => row.map( g => {
      g.addListener('dblclick', () => {
        const bounds = this.props.gMap.getBounds()
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
    if (!isEqual(this.state.gridPoints, prevState.gridPoints)) {
      isEmpty(this.state.visibleGridPoints) ?
      this.drawGridLayer() :
      this.eraseGridLayer()
    }

    if (!isEqual(this.state.rectangleBounds, prevState.rectangleBounds)) {
      isEmpty(this.state.visibleRectangle) ?
      this.drawRectangle() :
      this.eraseRectangle()
    }
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}></div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

Layer.propTypes = {
  gMap: React.PropTypes.object
}
