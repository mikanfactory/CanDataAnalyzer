import Rodal from 'rodal'
import React from 'react'
import MarkerActions from '../actions/MarkerActions'

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


export default class Modal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleModalClose() {
    MarkerActions.closeModal()
  }

  render() {
    return (
      <Rodal visible={this.props.isVisible}
             width={800}
             height={480}
             onClose={this.handleModalClose}>
        <div className="ModalHeader" style={HeaderStyle}>
          Edit {this.props.target} : {this.props.title}
        </div>
        <div className="ModalBody" style={BodyStyle}>
          <div style={{ width: "100%" }}>
            <span style={{ paddingRight: "20px" }}>Conditions</span>
            <span className="glyphicon glyphicon-plus-sign"></span>
            <span className="glyphicon glyphicon-minus-sign" style={{marginLeft: "10px"}}></span>
          </div>
          <div className="ConditionsContainer">
            <form className="form-inline">
              <div style={ConditionStyle}>
                <span style={RawTextStyle}>if</span>
                <select className="form-control feature" style={SelectStyle}>
                  <option>Velocity</option>
                  <option>Average</option>
                </select>
                <select className="form-control operator" style={SelectStyle}>
                  <option>{">"}</option>
                  <option>{"<"}</option>
                  <option>{"="}</option>
                </select>
                <input type="text" placeholder="10.0" style={TextStyle} />
                <span style={RawTextStyle}>then</span>
                <select className="form-control status" style={SelectStyle}>
                  <option>green</option>
                  <option>yello</option>
                  <option>blue</option>
                </select>
              </div>
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
  conditionIDs: React.PropTypes.Array,
}
