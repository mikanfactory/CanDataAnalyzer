import MessageActions from '../actions/MessageActions'
import MessageStore from '../stores/MessageStores'
import { MessageStyle as s} from './Styles'
import isEmpty from 'lodash/isEmpty'

function getStateFromStores() {
  return {
    message: MessageStore.getMessage()
  }
}

export default class Message extends React.Component {
  construcor(props) {
    super(props)

    this.state = getStateFromStores()
  }

  componentDidMount() {
    MessageStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
  }

  render() {
    return isEmpty(this.state.message) ?
           false :
           <div>{this.state.message.text}</div>
  }

  _onChange() {
    this.setState(getStateFromStores())
  }
}
