import React from 'react'
import Rodal from 'rodal'
import MessageActions from '../actions/MessageActions'
import MessageStore from '../stores/MessageStore'
import { MessageStyle as s} from './Styles'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    message: MessageStore.getMessage()
  }
}

export default class Message extends React.Component {
  constructor(props) {
    super(props)

    this.state = getStateFromStores()
  }

  handleMessageDelete() {
    MessageActions.deleteMessage()
  }

  componentDidMount() {
    MessageStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <Rodal visible={isEmpty(this.state.message)} width={400} height={720}
             onClose={this.handleMessageDelete}>
        <div className="Message" style={s.MessageStyle}>{this.state.message.text}</div>
      </Rodal>
    )
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}
