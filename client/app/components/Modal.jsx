import Rodal from 'rodal'
import React from 'react'
import MarkerActions from '../actions/MarkerActions'

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
        <div className="ModalHeader">Settings - {this.props.target} - {this.props.title}</div>
        <div className="TEMP">{this.props.modalType}</div>
        <div className="ModalBody">
          <div>
            <span>condition</span>
            <span><button className="btn btn-primary">+</button></span>
          </div>
          <div>{"if feature > 10.0"}</div>
        </div>
        <button className="rodal-comfirm-btn" onClick={this.handleModalClose}>OK</button>
        <button className="rodal-cancel-btn" onClick={this.handleModalClose}>Cancel</button>
      </Rodal>
    )
  }
}

Modal.PropTypes = {
  isVisible: React.PropTypes.bool,
  id: React.PropTypes.number,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
  conditionIDs: React.PropTypes.Array,
}
