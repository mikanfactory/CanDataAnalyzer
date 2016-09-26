import React from 'react'
import LayerStore from '../stores/LayerStore'
import { createRectangle, createRectangles } from '../utils/AppGoogleMapUtil'
import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    gridPoints: LayerStore.getGridPoints(),
    divideSize: LayerStore.getDivideSize(),
  }
}

export default class Layer extends React.Component {
  constructor(props) {
    super(props)

    this.state = assign({}, getStateFromStores(), { visibleGridPoints: [] })

    this.drawGridLayer = this.drawGridLayer.bind(this)
    this.eraseGridLayer = this.eraseGridLayer.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  drawGridLayer() {
    const { gridPoints } = this.state
    const rectangles = createRectangles(this.props.gMap, gridPoints)
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
