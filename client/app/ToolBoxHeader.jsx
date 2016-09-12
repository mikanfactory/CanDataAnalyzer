import React from 'react'
import Rodal from 'rodal'

const HeaderStyle = {
  color: "#FFF",
  backgroundColor: "#00BCD4",
  fontWeight: "200",
  lineHeight: "64px",
  paddingLeft: "20px",
  paddingRight: "10px",
  textAlign: "right"
}

const StringStyle = {
  float: "left",
  fontSize: "24px"
}

const GlyphiconStyle = { padding: "0 10px" }

export default class ToolBoxHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: {
        visible: false
      }
    }

    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  handleOpenModal() {
    this.setState({ modal: { visible: true } })
  }

  handleCloseModal() {
    this.setState({ modal: { visible: false } })
  }

  render() {
    return (
      <div>
        <div className="ToolBoxHeader" style={HeaderStyle}>
          <span style={StringStyle}>CanDataAnalyzer</span>
          <span className="glyphicon glyphicon-plus"
                style={GlyphiconStyle}
                onClick={this.handleOpenModal}>
          </span>
          <span className="glyphicon glyphicon-film"
                style={GlyphiconStyle}
                onClick={this.handleOpenModal}>
          </span>
        </div>
        <Rodal visible={this.state.modal.visible}
               width={800}
               height={480}
               onClose={this.handleCloseModal}>
          <div className="ModalHeader">Rodal</div>
          <div className="ModalBody">A react modal with animations</div>
          <button className="rodal-comfirm-btn" onClick={this.handleCloseModal}>OK</button>
          <button className="rodal-cancel-btn" onClick={this.handleCloseModal}>Cancel</button>
        </Rodal>
      </div>
    )
  }
}
