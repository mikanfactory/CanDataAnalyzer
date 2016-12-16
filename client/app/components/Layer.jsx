import React from 'react'
import GridLayer from './GridLayer'
import HeatmapLayer from './HeatmapLayer'
import ClusterLayer from './ClusterLayer'
import OverlayLayer from './OverlayLayer'
import TaskIndexLayer from './TaskIndex.jsx'

export default class Layer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Layer" style={{height: 0, width: 0}}>
        <GridLayer gMap={this.props.gMap} />
        <HeatmapLayer gMap={this.props.gMap} />
        <ClusterLayer gMap={this.props.gMap} />
        <OverlayLayer gMap={this.props.gMap} />
        <TaskIndexLayer gMap={this.props.gMap} />
      </div>
    )
  }
}

Layer.propTypes = {
  gMap: React.PropTypes.object
}
