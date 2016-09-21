import React from 'react'
import Modal from "./Modal"
import GoogleMap from './GoogleMap'
import ToolBox from './AnalysisToolBox.jsx'
import GMapStore from '../stores/GMapStore'

const ContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

function getStateFromStores() {
  return {
    gMap: GMapStore.getMap(),
  }
}

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()

    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    GMapStore.addChangeListener(this._onChange)

    // Because this function runs after GoogleMap#ComponentDidMount,
    // rerender and pass gMap to child component.
    this.setState(getStateFromStores())
  }

  componentWillUnmount() {
    GMapStore.removeChangeListener(this._onChange)
  }

  render() {
    return (
      <div className="Container" style={ContainerStyle}>
        <GoogleMap />
        <ToolBox gMap={this.state.gMap} />
        <Modal />
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}
