import React from 'react'
import ModalAction from '../actions/ModalActions'
import LayerAction from '../actions/LayerActions'
import { defaultDivideSize } from '../constants/AppConstants'
import { createGridPoints } from '../utils/AppGoogleMapUtil'
import { ToolBoxHeaderStyle as s } from './Styles'

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLayerVisible: false
    }

    this.handleGridLayerDisplay = this.handleGridLayerDisplay.bind(this)
    this.handleGridLayerToggle = this.handleGridLayerToggle.bind(this)
    this.handleLayerDisplay = this.handleLayerDisplay.bind(this)
    this.handleLayerToggle = this.handleLayerToggle.bind(this)
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
    const bounds = this.props.gMap.getBounds()
    LayerAction.createRectangle(bounds)
  }

  handleLayerErase() {
    LayerAction.destroyRectangle()
  }

  handleGridLayerToggle() {
    this.state.isGridLayerVisible?
    this.handleGridLayerErase() :
    this.handleGridLayerDisplay()

    this.setState({ isGridLayerVisible: !this.state.isGridLayerVisible })
  }

  handleGridLayerDisplay() {
    const gridPoints = createGridPoints(this.props.gMap, defaultDivideSize)
    LayerAction.createGridPoints(gridPoints)
  }

  handleGridLayerErase() {
    LayerAction.destroyGridPoints()
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={s.HeaderStyle}>
          <span style={s.StringStyle}>CanDataAnalyzer</span>
          <span className="glyphicon glyphicon-th"
                style={s.GlyphiconStyle}
                onClick={this.handleLayerToggle}>
          </span>
          <span className="glyphicon glyphicon-plus"
                style={s.GlyphiconStyle}
                onClick={this.handleModalOpen}>
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
