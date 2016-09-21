import React from 'react'
import ToolBoxHeader from './ToolBoxHeader'
import MarkerList from './MarkerList'
import SettingStore from '../stores/SettingStore'

const ToolBoxStyle = {
  position: 'relative',
  float: 'left',
  width: '25%',
  height: '770px',
  overflow: 'scroll'
}

function getStateFromStores() {
  return {
    settings: SettingStore.getAllSettings(),
  }
}

export default class AnalysisToolBox extends React.Component {
  constructor(props) {
    super(props)

    this.getMarkerList = this.getMarkerList.bind(this)
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
      <div className="AnalysisToolBox" style={ToolBoxStyle}>
        <ToolBoxHeader />
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
