import React from 'react'
import LayerStore from '../stores/LayerStore'
import { defaultDivideSize } from '../constants/AppConstants'

import { createGridPoints } from '../utils/AppGoogleMapUtil'
import { getGridPositions } from '../utils/AppAlgorithmUtil'

import assign from 'object-assign'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

import routes from '../../../data/working/route.csv'

function getStateFromStores() {
  return {
    bounds: LayerStore.getBounds(),
    isRouteIndexVisible: LayerStore.getRouteIndexVisibility()
  }
}

class RIOverlay extends window.google.maps.OverlayView {
  constructor(index, position, gMap) {
    super()
    this._index = index
    this._position = position
    this._gMap = gMap

    this._div = null;
    this.setMap(gMap);
  }

  onAdd() {
    let div = document.createElement('div')
    div.className = "overlay"
    div.innerHTML = String(this._index)

    this._div = div

    let panes = this.getPanes()
    panes.overlayLayer.appendChild(div)
  }


  draw() {
    var overlayProjection = this.getProjection();
    var pos = overlayProjection.fromLatLngToDivPixel(this._position);

    var div = this._div
    div.style.left = (pos.x - 15) + 'px'
    div.style.top = (pos.y - 15) + 'px'
  }

  onRemove() {
    this._div.parentNode.removeChild(this._div)
    this._div = null
  }
}

export default class RouteIndex extends React.Component {
  constructor(props) {
    super(props)

    const s = { overlays: [] }
    this.state = assign({}, getStateFromStores(), s)

    this._onChange = this._onChange.bind(this)
  }

  drawOverlays() {
    const { bounds } = this.state
    const { gMap } = this.props
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const rs = getGridPositions(gridPoints)

    const overlays = rs.map( (position, index) => {
      if (Number(routes[index].frame) > 0) {
        new RIOverlay(index, position, gMap)
      }
    })

    this.setState({ overlays: overlays })
  }

  eraseOverlays() {
    const { overlays } = this.state
    overlays.forEach( (overlay) => {
      overlay.setMap(null)
    })
  }

  componentDidMount() {
    LayerStore.addChangeListener(this._onChange)
  }

  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChange)
  }

  componentDidUpdate(prevProps, prevState) {
    if(!isEqual(this.state.isRouteIndexVisible, prevState.isRouteIndexVisible)) {
      isEmpty(this.state.overlays) ?
      this.drawOverlays() :
      this.eraseOverlays()
    }
  }

  render() {
    return (
      <div className="RouteIndex" style={{height: 0, width: 0}}>
        <div id="dummyOverlay"></div>
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

RouteIndex.propTypes = {
  gMap: React.PropTypes.object
}
