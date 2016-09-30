import React from 'react'
import Modal from "./Modal"
import GoogleMap from './GoogleMap'
import Layer from './Layer'
import ToolBox from './AnalysisToolBox'
import Message from './Message'
import GMapStore from '../stores/GMapStore'
import { ContainerStyle as s } from './Styles'

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
      <div className="Container" style={s.ContainerStyle}>
        <GoogleMap />
        <Layer gMap={this.state.gMap} />
        <ToolBox gMap={this.state.gMap} />
        <Modal />
        <Message />
      </div>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}
