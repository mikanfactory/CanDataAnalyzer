import React from 'react'
import Rodal from 'rodal'
import ConditionForm from './ConditionForm'
import ModalActions from '../actions/ModalActions'
import SettingActions from '../actions/SettingActions'
import MarkerActions from '../actions/MarkerActions'
import ConditionActions from '../actions/ConditionActions'
import ModalStore from '../stores/ModalStore'
import SettingStore from '../stores/SettingStore'
import ConditionStore from '../stores/ConditionStore'
import AppConstants from '../constants/AppConstants'
import { TARGETS } from '../constants/AppConstants.jsx'
import { ModalStyle as s } from './Styles'

import 'whatwg-fetch'
import  { fetchMarkers } from '../utils/AppWebAPIUtils'
import assign from 'object-assign'
import last from 'lodash/last'
import partial from 'lodash/partial'

const ModalTypes = AppConstants.ModalTypes

// TODO:
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
    this.handleRemoveCondition = this.handleRemoveCondition.bind(this)
    this.handleModalCancel = this.handleModalCancel.bind(this)
    this.handleFetchMarkers = this.handleFetchMarkers.bind(this)
    this._onChange = this._onChange.bind(this)
  }

  handleCreateCondition() {
    ConditionActions.createCondition(this.state.setting.id)
  }

  handleRemoveCondition() {
    if (this.state.conditions.length < 2)  return

    const cnd = last(this.state.conditions)
    ConditionActions.removeCondition(cnd.id)
  }

  handleModalCancel() {
    if (this.state.modal.modalType === ModalTypes.NEW) {
      ModalActions.cancelModal(this.state.setting.id)
      return
    }

    ModalActions.closeModal()
  }

  handleFetchMarkers() {
    const id = this.state.setting.id
    const cnds = this.state.conditions.filter( c => c.settingID === id )
    const data = assign({}, this.state.setting, { conditions: cnds })

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

  // TODO:
  getForm(condition, i) {
    return <ConditionForm key={i} {...condition} />
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
    const options = TARGETS.map( (o, i) => <option key={i} value={o}>{o}</option> )
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

  getCreateAndRemoveButtons() {
    return (
      <div style={{ width: "100%" }}>
        <span style={{ paddingRight: "20px" }}>Conditions</span>
        <span className="glyphicon glyphicon-plus-sign"
              onClick={this.handleCreateCondition}>
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
      <Rodal visible={!!this.state.setting} width={1300} height={720}
             onClose={this.handleModalCancel}>
        {this.getHeaderNode()}
        <div className="ModalBody" style={s.BodyStyle}>
          {this.getCreateAndRemoveButtons()}

          <div className="ConditionsContainer">
            <form className="form-inline">
              {formNodes}
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
