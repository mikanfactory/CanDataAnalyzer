import React from 'react'
import ConditionActions from '../actions/ConditionActions'
import { NUMBERS, LOGICS, FEATURES, OPERATORS, STATUS } from '../constants/AppConstants'
import assign from 'object-assign'
import { ConditionFormStyle as s } from './Styles'

export default class ModalForm extends React.Component {
  constructor(props) {
    super(props)

    this.getNumberNode = this.getNumberNode.bind(this)
    this.getLogicNode = this.getLogicNode.bind(this)
    this.getFeatureNode = this.getFeatureNode.bind(this)
    this.getOperatorNode = this.getOperatorNode.bind(this)
    this.getValueNode = this.getValueNode.bind(this)
    this.getStatusNode = this.getStatusNode.bind(this)
    this.getDetailNode = this.getDetailNode.bind(this)
  }

  getOptions(value, i) {
    return (
      <option key={i} value={value}>{value}</option>
    )
  }

  getNumberNode() {
    const options = NUMBERS.map(this.getOptions)
    return (
      <select className="form-control number"
              style={s.SelectStyle}
              defaultValue={"Single"}
              onChange={this.handleConditionChange.bind(this, 'detailNumber')} >
        {options}
      </select>
    )
  }

  getLogicNode(id) {
    const options = LOGICS.map(this.getOptions)
    return (
      <select className="form-control logic"
              style={s.SelectStyle}
              defaultValue={"and"}
              onChange={this.handleConditionChange.bind(this, 'logics', id)} >
        {options}
      </select>
    )
  }

  getFeatureNode(detail) {
    const options = FEATURES.map(this.getOptions)
    return (
      <select className="form-control feature"
              style={s.SelectStyle}
              defaultValue={detail.feature}
              onChange={this.handleDetailChange.bind(this, 'feature', detail.id)} >
        {options}
      </select>
    )
  }

  getOperatorNode(detail) {
    const options = OPERATORS.map(this.getOptions)
    return (
      <select className="form-control operator"
              style={s.SelectStyle}
              defaultValue={detail.feature}
              onChange={this.handleDetailChange.bind(this, 'operator', detail.id)} >
        {options}
      </select>
    )
  }

  getValueNode(detail) {
    return (
      <input type="text"
             value={this.getValue}
             placeholder={detail.feature}
             onChange={this.handleDetailChange.bind(this, 'value', detail.id)}
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

  getDetailNode() {
    switch (this.props.detailNumber) {
      case 1:
        let detail1 = this.props.details[0]
      return (
        <div>
          {this.getFeatureNode(detail1)}
          {this.getOperatorNode(detail1)}
          {this.getValueNode(detail1)}
        </div>
      )
      case 2:
        let detail1 = this.props.details[0]
        let detail2 = this.props.details[1]
      return (
        <div>
          {this.getFeatureNode(detail1)}
          {this.getOperatorNode(detail1)}
          {this.getValueNode(detail1)}
          {this.getLogicNode(0)}
          {this.getFeatureNode(detail2)}
          {this.getOperatorNode(detail2)}
          {this.getValueNode(detail2)}
        </div>
      )
      case 3:
        let detail1 = this.props.details[0]
        let detail2 = this.props.details[1]
        let detail3 = this.props.details[2]
      return (
        <div>
          {this.getFeatureNode(detail1)}
          {this.getOperatorNode(detail1)}
          {this.getValueNode(detail1)}
          {this.getLogicNode(0)}
          {this.getFeatureNode(detail2)}
          {this.getOperatorNode(detail2)}
          {this.getValueNode(detail2)}
          {this.getLogicNode(1)}
          {this.getFeatureNode(detail3)}
          {this.getOperatorNode(detail3)}
          {this.getValueNode(detail3)}
        </div>
      )
    }
  }

  handleConditionChange(key, e) {
    const tmp = {}
    tmp[key] = key === "detailNumber" ? parseFloat(e.target.value) :  e.target.value
    const cnd = assign({}, this.props, tmp)

    // TODO: if detailNumber changed, add new detail
    ConditionActions.updateCondition(cnd)
  }

  handleDetailChange(key, id, e) {
    const prevDetail = this.props.details[id]
    const tmp = {}
    tmp[key] = key === "valu" ? parseFloat(e.target.value) : e.target.value
    const nextDetail = assign({}, prevDetail, tmp)

    // TODO:
    ConditionActions.updateDetail(nextDetail)
  }

  render() {
    return (
      <div key={this.props.id} style={s.ConditionStyle}>
        <span style={s.CaseTextStyle}>{"case "}</span>
        {this.getNumberNode()}
        <span style={s.RawTextStyle}>{"("}</span>
        {this.getFeatureNode()}
        {this.getOperatorNode()}
        {this.getValueNode()}
        <span style={s.RawTextStyle}>{") => "}</span>
        {this.getStatusNode()}
      </div>
    )
  }

}

ModalForm.propTypes = {
  id: React.PropTypes.number,
  settingID: React.PropTypes.number,
  detailNumber: React.PropTypes.number,
  logics: React.PropTypes.array,
  status: React.PropTypes.string,
  details: React.PropTypes.array
}
