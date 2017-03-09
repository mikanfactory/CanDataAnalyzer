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
      isTaskIndexVisible: false
    }

    this.handleLayerToggle = this.handleLayerToggle.bind(this)
    this.handleHeatmapToggle = this.handleHeatmapToggle.bind(this)
    this.handleTaskToggle = this.handleTaskToggle.bind(this)
    this.handleRiskToggle = this.handleRiskToggle.bind(this)
    this.handleOverlayToggle = this.handleOverlayToggle.bind(this)
    this.handleSwitchPointDisplay = this.handleSwitchPointDisplay.bind(this)
    this.handleTaskIndexToggle = this.handleTaskIndexToggle.bind(this)
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
      text: "// DO NOT EDIT. \n// THIS MARKERS FETCHED BY META DB. \n// DO NOT EDIT. \n"
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

  handleTaskIndexToggle() {
    this.state.isTaskIndexVisible ?
    this.handleTaskIndexErase() :
    this.handleTaskIndexDisplay()

    this.setState({ isTaskIndexVisible: !this.state.isTaskIndexVisible })
  }

  handleTaskIndexDisplay() {
    fetchTasks((grid, clusters) => {
      LayerActions.createTaskIndexLayer(clusters)
    })
  }

  handleTaskIndexErase() {
    LayerActions.destroyTaskIndexLayer()
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={s.HeaderStyle}>
          <div style={s.StringStyle}>CANDY</div>
          <div className="dropmenu">
            <div className="actions">
              <a href="#">Actions ▼</a>
              <ul>
                <li onClick={this.handleModalOpen}><a href="#">新しいマーカーの作成</a></li>
                <li onClick={this.handleLayerToggle}><a href="#">グリッドを表示/非表示</a></li>
                <li onClick={this.handleHeatmapToggle}><a href="#">ヒートマップの表示/非表示</a></li>
                <li onClick={this.handleSaveHeatmapSetting}><a href="#">グリッドの結果を保存</a></li>
                <li onClick={this.handleTaskToggle}><a href="#">タスククラスタリングの結果を表示/非表示</a></li>
                <li onClick={this.handleRiskToggle}><a href="#">危険度の結果を表示/非表示</a></li>
                <li onClick={this.handleOverlayToggle}><a href="#">通過点のインデックスを表示</a></li>
                <li onClick={this.handleTaskIndexToggle}><a href="#">通過点のクラスタインデックスを表示</a></li>
                <li onClick={this.handleSwitchPointDisplay}><a href="#">動作の切り替わり点を表示</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ToolBoxHeader.propTypes = {
  gMap: React.PropTypes.object,
  latestID: React.PropTypes.number
}
