import Rodal from 'rodal'
import React from 'react'
import MarkerActions from '../actions/MarkerActions'

const MODAL_TYPE_EDIT = 'Edit'
const MODAL_TYPE_NEW = 'New'

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
  marginRight: "20px"
}

const TextStyle = {
  width: "50px",
  fontSize: "20px",
  marginRight: "20px"
}

const SelectStyle = {
  marginRight: "20px"
}

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
      "conditions": []
    }

    this.getFeature = this.getFeature.bind(this)
    this.getOperator = this.getOperator.bind(this)
    this.getStatus = this.getStatus.bind(this)
  }

  handleModalClose() {
    MarkerActions.closeModal()
  }

  getFeature() {
    const feature = "AccelerationX"
    const options = Features.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control feature"
              style={SelectStyle}
              defaultValue={feature} >
        {options}
      </select>
    )
  }

  getOperator() {
    const operator = ">"
    const options = Operators.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control operator"
              style={SelectStyle}
              defaultValue={operator}>
        {options}
      </select>
    )
  }

  getStatus() {
    const status = "green"
    const options = Status.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control status"
              style={SelectStyle}
              defaultValue={status}>
        {options}
      </select>
    )
  }

  render() {
    const conditions = this.props.conditionIDs.map( i => {
      return (
        <div key={i} style={ConditionStyle}>
          <span style={RawTextStyle}>if</span>
          {this.getFeature()}
          {this.getOperator()}
          <input type="text" placeholder="10.0" style={TextStyle} />
          <span style={RawTextStyle}>then</span>
          {this.getStatus()}
        </div>
      )
    })

    return (
      <Rodal visible={this.props.isVisible}
             width={800}
             height={480}
             onClose={this.handleModalClose}>
        <div className="ModalHeader" style={HeaderStyle}>
          {this.props.modalType}: {this.props.target} {this.props.title}
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
                onClick={this.handleModalClose}>OK</button>
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
  conditionIDs: React.PropTypes.array,
  conditions: React.PropTypes.array
}
