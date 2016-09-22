import React from 'react'
import Rodal from 'rodal'
import ModalForm from './ModalForm'
import ModalActions from '../actions/ModalActions'
import SettingActions from '../actions/SettingActions'
import MarkerActions from '../actions/MarkerActions'
import ConditionActions from '../actions/ConditionActions'
import ModalStore from '../stores/ModalStore'
import SettingStore from '../stores/SettingStore'
import ConditionStore from '../stores/ConditionStore'
import AppConstants from '../constants/AppConstants'
import { TARGETS } from '../constants/AppConstants.jsx'

import 'whatwg-fetch'
import  { checkStatus } from '../utils/AppWebAPIUtils'
import assign from 'object-assign'

const ModalTypes = AppConstants.ModalTypes

const HeaderStyle = {
  fontSize: "32px",
  borderBottom: "1px solid #e9e9e9"
}

const TargetStyle = {
  marginLeft: "10px",
  fontSize: "28px",
  width: "300px",
  display: "inline-block",
}

const BodyStyle = {
  fontSize: "28px",
  paddingTop: "20px"
}

const TitleStyle = {
  width: "130px",
  fontSize: "24px"
}

const OKButtonStyle = {
  width: "90px",
  position: "absolute",
  bottom: "10%",
  right: "17%"
}

const CancelButtonStyle = {
  position: "absolute",
  bottom: "10%",
  right: "5%"
}

function getStateFromStores() {
  const modal = ModalStore.getVisibleModal()
  const setting = SettingStore.getSetting(modal.settingID)
  const conditions = ConditionStore.getConditions(modal.settingID)

  return {
    modal: modal,
    setting: setting,
    conditions: conditions
  }
}

export default class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = getStateFromStores()

    this.getHeaderNode = this.getHeaderNode.bind(this)
    this.handleCreateCondition = this.handleCreateCondition.bind(this)
    this.handleModalCancel = this.handleModalCancel.bind(this)
    this.handleFetchMarkers = this.handleFetchMarkers.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  handleCreateCondition() {
    ConditionActions.createCondition(this.state.setting.id)
  }

  // TODO
  handleRemoveCondition() {
  }

  handleModalClose() {
    ModalActions.closeModal()
  }

  handleModalCancel() {
    ModalActions.cancelModal(this.state.setting.id)
  }

  handleFetchMarkers() {
    const id = this.state.setting.id
    const cnds = this.state.conditions.filter( c => c.settingID === id )
    const data = assign({}, this.state.setting, { conditions: cnds })

    fetch("/api/v1/markers", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(resp => checkStatus(resp, 200))
      .then(resp => resp.json())
      .then(markers => MarkerActions.createMarkers(markers))
      .then(() => ModalActions.closeModal())
      .catch(err => console.log('post setting error:', err))
  }

  getForm(condition, i) {
    return <ModalForm key={i} {...condition} />
  }

  getHeaderNode() {
    if (!this.state.modal) return ""

    let header = ""

    if (this.state.modal.modalType === ModalTypes.NEW) {
      header = "New"
    }

    if (this.state.modal.modalType === ModalTypes.EDIT) {
      const { setting } = this.state
      header = "Edit: " + setting.target + setting.title
    }

    return (
      <div className="ModalHeader" style={HeaderStyle}>
        {header}
      </div>
    )
  }

  getTargetNode() {
    const options = TARGETS.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control target" style={TargetStyle}
              defaultValue="Target"
              onChange={this.handleSettingChange.bind(this, "target")} >
        {options}
      </select>
    )
  }

  getTitleNode() {
    return (
      <input type="text" placeholder="Title" style={TitleStyle}
             onChange={this.handleSettingChange.bind(this, "title")} />
    )
  }

  getCreateAndRemoveButtons() {
    return (
      <div style={{ width: "100%" }}>
        <span style={{ paddingRight: "20px" }}>Conditions</span>
        <span className="glyphicon glyphicon-plus-sign"
              onClick={this.createCondition}>
        </span>
        <span className="glyphicon glyphicon-minus-sign"
              style={{marginLeft: "10px"}}
              onClick={this.handleRemoveCondition}>
        </span>
      </div>
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
    ConditionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ModalStore.addChangeListener(this._onChange);
    SettingStore.addChangeListener(this._onChange);
    ConditionStore.addChangeListener(this._onChange);
  }

  render() {
    const formNodes = this.state.conditions.map(this.getForm)

    return (
      <Rodal visible={!!this.state.setting} width={800} height={480}
             onClose={this.handleModalCancel}>
        {this.getHeaderNode()}
        <div className="ModalBody" style={BodyStyle}>
          {this.getCreateAndRemoveButtons()}

          <div className="ConditionsContainer">
            <form className="form-inline">
              {formNodes}
            </form>
          </div>
        </div>

        <button className="btn btn-primary btn-lg"
                style={OKButtonStyle}
                onClick={this.handleFetchMarkers}>OK</button>
        <button className="btn btn-default btn-lg"
                style={CancelButtonStyle}
                onClick={this.handleModalCancel}>Cancel</button>
      </Rodal>
    )
  }

  _onChange() {
    this.setState(getStateFromStores());
  }
}
