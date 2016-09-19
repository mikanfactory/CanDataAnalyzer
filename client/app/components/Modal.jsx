import React from 'react'
import Rodal from 'rodal'
import MarkerActions from '../actions/MarkerActions'
import 'whatwg-fetch'

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

const SettingStyle = {
  fontSize: "24px"
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
      target: "",
      title: "",
      conditions: []
    }

    this.getHeader = this.getHeader.bind(this)
    this.getConditions = this.getConditions.bind(this)
    this.handleSettingSave = this.handleSettingSave.bind(this)
  }

  handleModalClose() {
    MarkerActions.closeModal()
  }

  handleSettingSave() {
    const { id, target, title, conditions } = this.props
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
      .then(resp => resp.json())
      .then(markers => {
        MarkerActions.addNewMarkers(target, title, markers)
        MarkerActions.closeModal()
      })
      .catch(err => console.log('post setting error:', err))

    // MarkerActions.addSetting()
  }

  getHeader() {
    if (this.props.modalType === MODAL_TYPE_EDIT)  {
      return (
        <div>
          {this.props.modalType}: {this.props.target} {this.props.title}
        </div>
      )
    }

    return (
      <div>
        {this.props.modalType}: {this.getTargets()} {this.getTitle()}
      </div>
    )
  }

  getTargets() {
    const selectStyle = {
      marginLeft: "10px",
      fontSize: "28px",
      width: "300px",
      display: "inline-block",
    }
    const options = Targets.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control target" style={selectStyle}
              defaultValue="Target">
        {options}
      </select>
    )
  }

  getTitle() {
    const textStyle = { width: "130px", fontSize: "24px" }
    return (
      <input type="text" placeholder="Title" style={textStyle} />
    )
  }

  getFeature(feature) {
    const options = Features.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control feature"
              style={SelectStyle}
              defaultValue={feature} >
        {options}
      </select>
    )
  }

  getOperator(operator) {
    const options = Operators.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control operator"
              style={SelectStyle}
              defaultValue={operator}>
        {options}
      </select>
    )
  }

  getStatus(status) {
    const options = Status.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control status"
              style={SelectStyle}
              defaultValue={status}>
        {options}
      </select>
    )
  }

  getConditions() {
    let conditions = []
    switch (this.props.modalType) {
      case MODAL_TYPE_EDIT:
        conditions = this.props.conditions
                         .filter( c => c.settingID === this.props.id)
        break

      case MODAL_TYPE_NEW:
        const newCondition = {
          id: 0,
          settingID: this.props.id,
          feature: "Velocity",
          operator: "<",
          value: 5.0,
          status: "stop"
        }
        conditions = [newCondition]
        break

      case MODAL_TYPE_SHOW:
        conditions = []
        break

      default:
        conditions = []
        break
    }

    const nodes = conditions.map( cnd => {
      return (
        <div key={cnd.id} style={ConditionStyle}>
          <span style={RawTextStyle}>if</span>
          {this.getFeature(cnd.feature)}
          {this.getOperator(cnd.operator)}
          <input type="text" placeholder={cnd.value} style={TextStyle} />
          <span style={RawTextStyle}>then</span>
          {this.getStatus(cnd.status)}
        </div>
      )
    })

    return nodes
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isVisible) {
      this.setState({
        target: this.props.target,
        title: this.props.title,
        conditions: this.props.conditions
      })
    }
  }

  render() {
    const conditions = this.getConditions()

    const settingStyle = this.props.modalType === MODAL_TYPE_NEW ?
                         SettingStyle :
                         Object.assign({}, SelectStyle, { display: "none" })

    return (
      <Rodal visible={this.props.isVisible}
             width={800}
             height={480}
             onClose={this.handleModalClose}>
        <div className="ModalHeader" style={HeaderStyle}>
          {this.getHeader()}
        </div>
        <div className="ModalBody" style={BodyStyle}>
          <div style={{ width: "100%" }}>
            <span style={{ paddingRight: "20px" }}>Conditions</span>
            <span className="glyphicon glyphicon-plus-sign"></span>
            <span className="glyphicon glyphicon-minus-sign" style={{marginLeft: "10px"}}></span>
          </div>
          <div className="ConditionsContainer">
            <form className="form-inline">
              {conditions}
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
  id: React.PropTypes.number,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
  conditions: React.PropTypes.array
}
