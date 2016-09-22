import React from 'react'
import ConditionActions from '../actions/ConditionActions'
import { FEATURES, OPERATORS, STATUS } from '../constants/AppConstants'
import assign from 'object-assign'
import { ConditionFormStyle as s } from './Styles'

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = assign({}, this.props)

    this.getFeatureNode = this.getFeatureNode.bind(this)
    this.getOperatorNode = this.getOperatorNode.bind(this)
    this.getValueNode = this.getValueNode.bind(this)
    this.getStatusNode = this.getStatusNode.bind(this)
  }

  getOptions(value, i) {
    return (
      <option key={i} value={value}>{value}</option>
    )
  }

  getFeatureNode() {
    const options = FEATURES.map(this.getOptions)
    return (
      <select className="form-control feature"
              style={s.SelectStyle}
              defaultValue={this.props.feature}
              onChange={this.handleConditionChange.bind(this, 'feature')} >
        {options}
      </select>
    )
  }

  getOperatorNode() {
    const options = OPERATORS.map(this.getOptions)
    return (
      <select className="form-control operator"
              style={s.SelectStyle}
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
             style={s.TextStyle} />
    )
  }

  getStatusNode() {
    const options = STATUS.map(this.getOptions)
    return (
      <select className="form-control status"
              style={s.SelectStyle}
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
      <div key={this.props.id} style={s.ConditionStyle}>
        <span style={s.RawTextStyle}>if</span>
        {this.getFeatureNode()}
        {this.getOperatorNode()}
        {this.getValueNode()}
        <span style={s.RawTextStyle}>then</span>
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
