import React from 'react'
import ToolBoxHeader from './ToolBoxHeader'
import MarkerList from './MarkerList'
import SettingStore from '../stores/SettingStore'
import { ToolBoxStyle as s } from './Styles'

function getStateFromStores() {
  return {
    settings: SettingStore.getAllSettings(),
    settingLatestID: SettingStore.getLatestID()
  }
}

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()

    this.getMarkerList = this.getMarkerList.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  getMarkerList(setting) {
    return (
      <MarkerList key={setting.id} gMap={this.props.gMap} {...setting} />
    )
  }

  componentDidMount() {
    SettingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SettingStore.removeChangeListener(this._onChange);
  }

  render() {
    const markerListNodes = this.state.settings.map(this.getMarkerList)

    return (
      <div className="AnalysisToolBox" style={s.ToolBoxStyle}>
        <ToolBoxHeader gMap={this.props.gMap} latestID={this.state.settingLatestID}/>
        {markerListNodes}
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}

AnalysisToolBox.propTypes = {
  gMap: React.PropTypes.object
}
