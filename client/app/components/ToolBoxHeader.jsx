import React from 'react'
import ModalAction from '../actions/ModalActions'
import LayerAction from '../actions/LayerActions'
import { getSmallerBounds } from '../utils/AppGoogleMapUtil'
import { ToolBoxHeaderStyle as s } from './Styles'

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLayerVisible: false,
      isHeatmapVisible: false
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
    this.state.isHeatmapVisible ?
    this.handleHeatmapErase() :
    this.handleHeatmapDisplay()

    this.setState({ isHeatmapVisible: !this.state.isHeatmapVisible })
  }

  handleHeatmapDisplay() {
    LayerAction.createHeatmapLayer()
  }

  handleHeatmapErase() {
    LayerAction.destroyHeatmapLayer()
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
