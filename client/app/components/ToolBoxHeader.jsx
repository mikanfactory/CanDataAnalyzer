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
      isGridLayerVisible: false
    }

    this.handleGridLayerDisplay = this.handleGridLayerDisplay.bind(this)
  }

  handleModalOpen() {
    ModalAction.createModal()
  }

  handleGridLayerToggle() {
    this.state.isGridLayerVisible?
    this.handleGridLayerDisplay() :
    this.handleGridLayerErase()

    this.setState({ isGridLayerVisible: !this.isGridLayerVisible })
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
                onClick={this.handleGridLayerToggle}>
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
