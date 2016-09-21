import React from 'react'
import AppConstants from '../constants/AppConstants'
import ConditionActions from '../actions/ConditionActions'
import assign from 'object-assign'

const { FEATURES, OPERATORS, STATUS } = AppConstants

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

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props)

    const { id, settingID, feature, operator, value, status } = this.props

    this.state = {
      id: id,
      settingID: settingID,
      feature: feature,
      operator: operator,
      value: value,
      status: status
    }

    this.getFeatureNode = this.getFeatureNode.bind(this)
    this.getOperatorNode = this.getOperatorNode.bind(this)
    this.getValueNode = this.getValueNode.bind(this)
    this.getStatusNode = this.getStatusNode.bind(this)
  }

  getFeatureNode() {
    const options = FEATURES.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control feature"
              style={SelectStyle}
              defaultValue={this.props.feature}
              onChange={this.handleConditionChange.bind(this, 'feature')} >
        {options}
      </select>
    )
  }

  getOperatorNode() {
    const options = OPERATORS.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control operator"
              style={SelectStyle}
              defaultValue={this.props.operator}
              onChange={this.handleConditionChange.bind(this, 'operator')} >
        {options}
      </select>
    )
  }

  getValueNode() {
    return (
      <input type="text"
             value={this.getValue}
             placeholder={this.props.value}
             onChange={this.handleConditionChange.bind(this, 'value')}
             style={TextStyle} />
    )
  }

  getStatusNode() {
    const options = STATUS.map( o => <option value={o}>{o}</option> )
    return (
      <select className="form-control status"
              style={SelectStyle}
              defaultValue={this.props.status}
              onChange={this.handleConditionChange.bind(this, 'status')} >
        {options}
      </select>
    )
  }

  handleConditionChange(key, e) {
    const tmp = {}
    tmp[key] = key === "value" ? parseFloat(e.target.value) :  e.target.value
    const cnd = assign({}, this.state, tmp)
    ConditionActions.updateCondition(cnd)
  }

  render() {
    return (
      <div key={this.props.id} style={ConditionStyle}>
        <span style={RawTextStyle}>if</span>
        {this.getFeatureNode()}
        {this.getOperatorNode()}
        {this.getValueNode()}
        <span style={RawTextStyle}>then</span>
        {this.getStatusNode()}
      </div>
    )
  }

}

ModalForm.propTypes = {
  id: React.PropTypes.number,
  settingID: React.PropTypes.number,
  feature: React.PropTypes.string,
  operator: React.PropTypes.string,
  value: React.PropTypes.number,
  status: React.PropTypes.string,
}
