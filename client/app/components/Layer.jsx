import React from 'react'
import LayerStore from '../stores/LayerStore'
import { createRectangle, createRectangles, createGridPoints } from '../utils/AppGoogleMapUtil'
import assign from 'object-assign'

function getStateFromStores() {
  return {
    Layers: LayerStore.getLayers(),
    divideSize: LayerStore.getDivideSize(),
  }
}

export default class Layer extends React.Component {
  constructor(props) {
    super(props)

    this.state = assign({}, getStateFromStores(), { visibleLayers: [] })

    this._onChange = this._onChange.bind(this)
  }

  drawGrid() {
    const gridPoints = createGridPoints(this.props.gMap, this.state.divideSize)
    const rectangles = createRectangles(this.props.gMap, gridPoints)
    this.setState({ visibleLayers: rectangles })
  }

  eraseGrid() {
    this.visibleLayers.forEach( row => row.map( g => g.setMap(null) ) )
    this.setState({ visibleLayers: [] })
  }

  componentDidUpdate(prevProps, prevState) {
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
