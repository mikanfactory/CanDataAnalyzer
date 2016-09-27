import React from 'react'
import ModalAction from '../actions/ModalActions'
import LayerAction from '../actions/LayerActions'
import { getSmallerBounds } from '../utils/AppGoogleMapUtil'
import { ToolBoxHeaderStyle as s } from './Styles'

function getPoints() {
  return _getPoints().map( px => {
    return new window.google.maps.LatLng(...px)
  })
}

function _getPoints() {
  return [...Array(100).keys()].map( () => {
    return [
      36.08 + 0.01*getRandomArbitary(-1, 1),
      140.21 + 0.01*getRandomArbitary(-1, 1)
    ]
  })
}

function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLayerVisible: false
    }

    this.handleLayerToggle = this.handleLayerToggle.bind(this)
    this.handleHeatmapToggle = this.handleHeatmapToggle.bind(this)
  }

  handleModalOpen() {
    ModalAction.createModal()
  }

  handleLayerToggle() {
    this.state.isLayerVisible ?
    this.handleLayerErase() :
    this.handleLayerDisplay()

    this.setState({ isLayerVisible: !this.state.isLayerVisible })
  }

  handleLayerDisplay() {
    const bounds = getSmallerBounds(this.props.gMap)
    LayerAction.createRectangle(bounds)
  }

  handleLayerErase() {
    LayerAction.destroyAllLayer()
  }

  handleHeatmapToggle() {
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: getPoints(),
      map: this.props.gMap,
      radius: 100,
    })
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={s.HeaderStyle}>
          <span style={s.StringStyle}>CanDataAnalyzer</span>
          <span className="glyphicon glyphicon-plus"
                style={s.GlyphiconStyle}
                onClick={this.handleModalOpen}>
          </span>
          <span className="glyphicon glyphicon-th"
                style={s.GlyphiconStyle}
                onClick={this.handleLayerToggle}>
          </span>
          <span className="glyphicon glyphicon-fire"
                style={s.GlyphiconStyle}
                onClick={this.handleHeatmapToggle}>
          </span>
          <span className="glyphicon glyphicon-film"
                style={s.GlyphiconStyle}
                onClick={this.handleModalOpen}>
          </span>
        </div>
      </div>
    )
  }
}

ToolBoxHeader.propTypes = {
  gMap: React.PropTypes.object
}
