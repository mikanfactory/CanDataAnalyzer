import React from 'react'
import LayerStore from '../stores/LayerStore'
import MarkerStore from '../stores/MarkerStore'
import SettingStore from '../stores/SettingStore'
import LayerActions from '../actions/LayerActions'
import ModalActions from '../actions/ModalActions'
import SettingActions from '../actions/SettingActions'
import MarkerActions from '../actions/MarkerActions'
import MessageActions from '../actions/MessageActions'
import { sendHeatmapSetting, fetchTasks, fetchRisks, fetchSwitchPoint } from '../utils/AppWebAPIUtils.jsx'
import { createGridSetting, createGridPoints } from '../utils/AppGoogleMapUtil'
import { convertMarkersToHeatmapData } from '../utils/AppAlgorithmUtil'
import { ToolBoxHeaderStyle as s } from './Styles'
import { defaultDivideSize } from '../constants/AppConstants'

import { parseAll } from '../utils/AppParserUtil'
import assign from 'object-assign'
import * as p from 'eulalie'

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLayerVisible: false,
      isHeatmapVisible: false,
      isClusterVisible: false,
    }

    this.handleLayerToggle = this.handleLayerToggle.bind(this)
    this.handleHeatmapToggle = this.handleHeatmapToggle.bind(this)
    this.handleTaskToggle = this.handleTaskToggle.bind(this)
    this.handleRiskToggle = this.handleRiskToggle.bind(this)
    this.handleOverlayToggle = this.handleOverlayToggle.bind(this)
    this.handleSwitchPointDisplay = this.handleSwitchPointDisplay.bind(this)
  }

  handleModalOpen() {
    ModalActions.createModal()
  }

  handleLayerToggle() {
    this.state.isLayerVisible ?
    this.handleLayerErase() :
    this.handleLayerDisplay()

    this.setState({ isLayerVisible: !this.state.isLayerVisible })
  }

  handleLayerDisplay() {
    LayerActions.createRectangle()
  }

  handleLayerErase() {
    LayerActions.destroyAllLayer()
  }

  handleHeatmapToggle() {
    this.state.isHeatmapVisible ?
    this.handleHeatmapErase() :
    this.handleHeatmapDisplay()

    this.setState({ isHeatmapVisible: !this.state.isHeatmapVisible })
  }

  handleHeatmapDisplay() {
    LayerActions.createHeatmapLayer()
  }

  handleHeatmapErase() {
    LayerActions.destroyHeatmapLayer()
  }

  handleSaveHeatmapSetting() {
    const bounds = LayerStore.getBounds()
    const gridPoints = createGridPoints(bounds, defaultDivideSize)
    const markers = MarkerStore.getAllMarkers()
    const hm = convertMarkersToHeatmapData(markers, gridPoints)

    const gridSetting = createGridSetting(bounds, defaultDivideSize)

    const settings = SettingStore.getAllSettings().map( st => {
      const stream = p.stream(st.text)
      const result = p.parse(parseAll, stream)
      if (p.isError(result)) {
        MessageActions.createMessage({ text: result.print().replace("\n", "<br>") })
        return
      }
      return assign({}, st, { conditions: result.value })
    })

    const heatmap = assign({}, hm, { grid: gridSetting, settings: settings })
    sendHeatmapSetting(heatmap)
  }

  handleTaskToggle() {
    this.state.isClusterVisible ?
    this.handleTaskErase() :
    this.handleTaskDisplay()

    this.setState({ isClusterVisible: !this.state.isClusterVisible })
  }

  handleTaskDisplay() {
    fetchTasks((grid, clusters) => {
      const bounds = new window.google.maps.LatLngBounds(grid.southWest, grid.northEast)
      LayerActions.createClusters(bounds, clusters)
    })
  }

  handleTaskErase() {
    LayerActions.destroyClusters()
  }

  handleRiskToggle() {
    this.state.isClusterVisible ?
    this.handleRiskErase() :
    this.handleRiskDisplay()

    this.setState({ isClusterVisible: !this.state.isClusterVisible })
  }

  handleRiskDisplay() {
    fetchRisks((grid, risks) => {
      const bounds = new window.google.maps.LatLngBounds(grid.southWest, grid.northEast)
      LayerActions.createClusters(bounds, risks)
    })
  }

  handleRiskErase() {
    LayerActions.destroyClusters()
  }

  handleSwitchPointDisplay() {
    const settingID = this.props.latestID + 1
    SettingActions.createSetting({
      id: settingID,
      target: "All",
      title: "Switching Points",
      text: "\\ DO NOT EDIT. \n \\ THIS MARKERS FETCHED BY META DB. \n \\ DO NOT EDIT. \n"
    })
    fetchSwitchPoint(settingID, markers => {
      MarkerActions.createMarkers(markers)
      console.log(markers)
    })
  }


  handleOverlayToggle() {
    this.state.isOverlayVisible ?
    this.handleOverlayErase() :
    this.handleOverlayDisplay()

    this.setState({ isOverlayVisible: !this.state.isOverlayVisible })
  }

  handleOverlayDisplay() {
    fetchRisks((grid, risks) => {
      LayerActions.createOverlayLayer(risks)

    })
  }

  handleOverlayErase() {
    LayerActions.destroyOverlayLayer()
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={s.HeaderStyle}>
          <span style={s.StringStyle}>CANDY</span>
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
          <span className="glyphicon glyphicon-download-alt"
                style={s.GlyphiconStyle}
                onClick={this.handleSaveHeatmapSetting}>
          </span>
          <span className="glyphicon glyphicon-dashboard"
                style={s.GlyphiconStyle}
                onClick={this.handleTaskToggle}>
          </span>
          <span className="glyphicon glyphicon-sort"
                style={s.GlyphiconStyle}
                onClick={this.handleRiskToggle}>
          </span>
          <span className="glyphicon glyphicon-info-sign"
                style={s.GlyphiconStyle}
                onClick={this.handleOverlayToggle}>
          </span>
          <span className="glyphicon glyphicon-pushpin"
                style={s.GlyphiconStyle}
                onClick={this.handleSwitchPointDisplay}>
          </span>
        </div>
      </div>
    )
  }
}

ToolBoxHeader.propTypes = {
  gMap: React.PropTypes.object,
  latestID: React.PropTypes.number
}
