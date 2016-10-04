import React from 'react'
import Rodal from 'rodal'
import Editor from './Editor'
import ModalActions from '../actions/ModalActions'
import SettingActions from '../actions/SettingActions'
import MarkerActions from '../actions/MarkerActions'
import MessageActions from '../actions/MessageActions'
import ModalStore from '../stores/ModalStore'
import SettingStore from '../stores/SettingStore'
import AppConstants from '../constants/AppConstants'
import { switchSentence } from '../utils/AppParserUtil'
import { TARGETS } from '../constants/AppConstants.jsx'
import { ModalStyle as s } from './Styles'

import 'whatwg-fetch'
import  { fetchMarkers } from '../utils/AppWebAPIUtils'
import assign from 'object-assign'
import partial from 'lodash/partial'
import * as p from 'eulalie'

const ModalTypes = AppConstants.ModalTypes

function getStateFromStores() {
  const modal = ModalStore.getVisibleModal()
  const setting = SettingStore.getSetting(modal.settingID)

  return {
    modal: modal,
    setting: setting,
  }
}

export default class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()

    this.getHeaderNode = this.getHeaderNode.bind(this)
    this.handleModalCancel = this.handleModalCancel.bind(this)
    this.handleFetchMarkers = this.handleFetchMarkers.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  handleModalCancel() {
    if (this.state.modal.modalType === ModalTypes.NEW) {
      ModalActions.cancelModal(this.state.setting.id)
      return
    }

    ModalActions.closeModal()
  }

  handleFetchMarkers() {
    const { id, text } = this.state.setting
    const stream = p.stream(text)
    const result = p.parse(switchSentence, stream)
    if (p.isError(result)) {
      MessageActions.createMessage({ text: result.print().replace("\n", "<br>") })
      return
    }

    const data = assign({}, this.state.setting, { conditions: result.value })

    if (this.state.modal.modalType === ModalTypes.NEW) {
      fetchMarkers(data, markers => {
        MarkerActions.createMarkers(markers)
        ModalActions.closeModal()
      })
    }

    if (this.state.modal.modalType === ModalTypes.EDIT) {
      const updateMarkers = partial(MarkerActions.updateMarkers, id)
      fetchMarkers(data, markers => {
        updateMarkers(markers)
        ModalActions.closeModal()
      })
    }
  }

  getHeaderNode() {
    if (!this.state.modal) return ""

    if (this.state.modal.modalType === ModalTypes.NEW) {
      return (
        <div className="ModalHeader" style={s.HeaderStyle}>
          New {this.getTargetNode()} {this.getTitleNode()}
        </div>
      )
    }

    if (this.state.modal.modalType === ModalTypes.EDIT) {
      const { setting } = this.state
      const header = `Edit: ${setting.target}  ${setting.title}`
      return (
        <div className="ModalHeader" style={s.HeaderStyle}>
          {header}
        </div>
      )
    }

  }

  getTargetNode() {
    const options = TARGETS.map( (o, i) =>
      <option key={i} value={o}>{o}</option>
    )
    return (
      <select className="form-control target" style={s.TargetStyle}
              defaultValue="Target"
              onChange={this.handleSettingChange.bind(this, "target")} >
        {options}
      </select>
    )
  }

  getTitleNode() {
    return (
      <input type="text" placeholder="Title" style={s.TitleStyle}
             onChange={this.handleSettingChange.bind(this, "title")} />
    )
  }

  getTextArea() {
    if (!this.state.setting) return

    return (
      <Editor text={this.state.setting.text} />
    )
  }

  handleSettingChange(key, e) {
    const tmp = {}
    tmp[key] = e.target.value
    const setting = assign({}, this.state.setting, tmp)
    SettingActions.updateSetting(setting)
  }

  componentDidMount() {
    ModalStore.addChangeListener(this._onChange);
    SettingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ModalStore.addChangeListener(this._onChange);
    SettingStore.addChangeListener(this._onChange);
  }

  render() {
    return (
      <Rodal visible={!!this.state.setting} width={1300} height={720}
             onClose={this.handleModalCancel}>
        {this.getHeaderNode()}
        <div className="ModalBody" style={s.BodyStyle}>
          <div className="ConditionsContainer">
            <div style={{ width: "100%" }}>
              <span style={{ paddingRight: "20px" }}>Conditions</span>
            </div>
            <form className="form-inline">
              {this.getTextArea()}
            </form>
          </div>
        </div>

        <button className="btn btn-primary btn-lg"
                style={s.OKButtonStyle}
                onClick={this.handleFetchMarkers}>OK</button>
        <button className="btn btn-default btn-lg"
                style={s.CancelButtonStyle}
                onClick={this.handleModalCancel}>Cancel</button>
      </Rodal>
    )
  }

  _onChange() {
    this.setState(getStateFromStores());
  }
}
