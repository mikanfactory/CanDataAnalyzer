import React from 'react'
import Rodal from 'rodal'
import MarkerActions from '../actions/MarkerActions'
import 'whatwg-fetch'
import uniqBy from 'lodash/uniqBy'

const MODAL_TYPE_EDIT = 'Edit'
const MODAL_TYPE_NEW  = 'New'
const MODAL_TYPE_SHOW = 'Show'

const HeaderStyle = {
  fontSize: "32px",
  borderBottom: "1px solid #e9e9e9"
}

const BodyStyle = {
  fontSize: "28px",
  paddingTop: "20px"
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

const ConditionStyle = {
  paddingTop: "20px",
}

const RawTextStyle = {
  fontSize: "24px",
  margin: "0 20px"
}

const TextStyle = {
  width: "50px",
  fontSize: "20px",
}

const SelectStyle = {
  marginRight: "20px"
}

const Targets = [
  "Target",
  "021021K1KAm",
  "021022K1KAm",
  "021023K1KAm",
  "021024K1KAm",
  "021025K1KAm",
  "021026K1KAm",
  "021027K1KAm",
  "021028K1KAm",
  "021029K1KAm",
  "021030K1KAm",
  "021031K1KAm",
  "021101K1KAm",
  "021021K2KBm",
  "021023K2KBm",
  "021024K2KBm",
]

const Features = [
  "AccelerationX",
  "GPSLatitude",
  "GPSLongtitude",
  "MapLongtitude",
  "MapLatitude",
  "SpeedPerHourLowpass",
  "BrakeOnOff",
  "BrakeOnOff",
  "AcceleratorOnOff",
  "Steering Angle",
  "AheadDistance",
  "AheadRelativitySpeed"
]

const Operators = [
  "<", "<=", "=", ">=", ">"
]

const Status = [
  "green", "yellow", "red",
  "up", "down", "right", "left",
  "straight", "stop",
  "empty", "normal"
]

export default class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: 0,
      target: "",
      title: "",
      conditions: []
    }

    this.getHeaderNode = this.getHeaderNode.bind(this)
    this.getConditions = this.getConditions.bind(this)
    this.addNewCondition = this.addNewCondition.bind(this)
    this.handleSettingSave = this.handleSettingSave.bind(this)
  }

  addNewCondition() {
    MarkerActions.addNewCondition(this.state.id)
  }

  handleModalClose() {
    MarkerActions.closeModal()
  }

  checkStatus(resp, code) {
    if (resp.status == code) {
      return resp
    } else {
      console.log(resp)
      const error = new Error(resp.statusText)
      error.resp = resp
      throw error
    }
  }

  handleSettingSave() {
    const { id, target, title, conditions } = this.state
    const cnds = conditions.filter( c => c.settingID === id )
    const data = {
      target: target,
      title: title,
      conditions: cnds
    }

    fetch("/api/v1/markers", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(resp => this.checkStatus(resp, 200))
    .then(resp => resp.json())
      .then(markers => {
        MarkerActions.addNewMarkers(target, title, markers)
        MarkerActions.closeModal()
      })
      .catch(err => console.log('post setting error:', err))

    // MarkerActions.addSetting()
  }

  getHeaderNode() {
    if (this.props.modalType === MODAL_TYPE_EDIT)  {
      return (
        <div>
          {this.props.modalType}: {this.props.target} {this.props.title}
        </div>
      )
    }

    return (
      <div>
        {this.props.modalType}: {this.getTargetNode()} {this.getTitleNode()}
      </div>
    )
  }

  getTargetNode() {
    const selectStyle = {
      marginLeft: "10px",
      fontSize: "28px",
      width: "300px",
      display: "inline-block",
    }
    const options = Targets.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control target" style={selectStyle}
              defaultValue="Target"
              onChange={this.handleSettingChange.bind(this, "target")} >
        {options}
      </select>
    )
  }

  getTitleNode() {
    const textStyle = { width: "130px", fontSize: "24px" }
    return (
      <input type="text" placeholder="Title" style={textStyle}
             onChange={this.handleSettingChange.bind(this, "title")} />
    )
  }

  getFeatureNode(cnd) {
    const options = Features.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control feature"
              style={SelectStyle}
              defaultValue={cnd.feature}
              onChange={this.handleConditionChange.bind(this, 'feature', cnd.id)} >
        {options}
      </select>
    )
  }

  getOperatorNode(cnd) {
    const options = Operators.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control operator"
              style={SelectStyle}
              defaultValue={cnd.operator}
              onChange={this.handleConditionChange.bind(this, 'operator', cnd.id)} >
        {options}
      </select>
    )
  }

  getStatusNode(cnd) {
    const options = Status.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control status"
              style={SelectStyle}
              defaultValue={cnd.status}
              onChange={this.handleConditionChange.bind(this, 'status', cnd.id)} >
        {options}
      </select>
    )
  }

  handleSettingChange(key, e) {
    if (key == "target") {
      this.setState({ target: e.target.value })
    } else {
      this.setState({ title: e.target.value })
    }
  }

  handleConditionChange(key, id, e) {
    const val = key === 'value' ?
                parseFloat(e.target.value) : e.target.value
    let cnd = this.state.conditions.find( c => c.id === id  )
    cnd[key] = val
    let cnds = uniqBy([...this.state.conditions, cnd], 'id')
    this.setState({ conditions: cnds })
  }

  getConditions() {
    let conditions = []
    switch (this.props.modalType) {
      case MODAL_TYPE_EDIT:
        conditions = this.props.conditions
                         .filter( c => c.settingID === this.props.id)
        break

      case MODAL_TYPE_NEW:
        conditions = this.props.conditions
                         .filter( c => c.settingID === this.props.id)
        break

      case MODAL_TYPE_SHOW:
        conditions = []
        break

      default:
        conditions = []
        break
    }

    const nodes = conditions.map( (cnd, i) => {
      return (
        <div key={cnd.id} style={ConditionStyle}>
          <span style={RawTextStyle}>if</span>
          {this.getFeatureNode(cnd)}
          {this.getOperatorNode(cnd)}
          <input type="text"
                 value={this.getValue}
                 placeholder={cnd.value}
                 onChange={this.handleConditionChange.bind(this, 'value', cnd.id)}
                 style={TextStyle} />
          <span style={RawTextStyle}>then</span>
          {this.getStatusNode(cnd)}
        </div>
      )
    })

    return nodes
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.id,
      target: nextProps.target,
      title: nextProps.title,
      conditions: nextProps.conditions
    })
  }

  render() {
    return (
      <Rodal visible={this.props.isVisible}
             width={800}
             height={480}
             onClose={this.handleModalClose}>
        <div className="ModalHeader" style={HeaderStyle}>
          {this.getHeaderNode()}
        </div>
        <div className="ModalBody" style={BodyStyle}>
          <div style={{ width: "100%" }}>
            <span style={{ paddingRight: "20px" }}>Conditions</span>
            <span className="glyphicon glyphicon-plus-sign"
                  onClick={this.addNewCondition}>
            </span>
            <span className="glyphicon glyphicon-minus-sign" style={{marginLeft: "10px"}}></span>
          </div>
          <div className="ConditionsContainer">
            <form className="form-inline">
              {this.getConditions()}
            </form>
          </div>
        </div>
        <button className="btn btn-primary btn-lg"
                style={OKButtonStyle}
                onClick={this.handleSettingSave}>OK</button>
        <button className="btn btn-default btn-lg"
                style={CancelButtonStyle}
                onClick={this.handleModalClose}>Cancel</button>
      </Rodal>
    )
  }
}

Modal.propTypes = {
  isVisible: React.PropTypes.bool,
  modalType: React.PropTypes.string,
  id: React.PropTypes.string,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
  conditions: React.PropTypes.array
}
