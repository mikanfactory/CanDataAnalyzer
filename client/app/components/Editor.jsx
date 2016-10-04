import React from 'react'
import ace from 'brace'
import { EditorStyle as s } from './Styles'
import { FEATURES } from '../constants/AppConstants'
import SettingActions from '../actions/SettingActions'

import assign from 'object-assign'
import 'brace/theme/textmate'
import 'brace/mode/javascript'
import 'brace/keybinding/emacs'
import 'brace/ext/language_tools'

export default class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = {}
    this._onChange = this._onChange.bind(this)
  }

  componentDidMount() {
    this.editor = ace.edit("editor")
    this.editor.setTheme("ace/theme/textmate")
    this.editor.getSession().setMode("ace/mode/javascript")
    this.editor.getSession().setUseWrapMode(false)
    this.editor.setValue(this.props.text, 1)
    this.editor.getSession().setTabSize(2);
    this.editor.getSession().setUseSoftTabs(false);
    this.editor.setFontSize(16)
    this.editor.setShowPrintMargin(false)
    this.editor.setKeyboardHandler('ace/keyboard/emacs')
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    })
    this.editor.on('change', this._onChange);
  }

  render() {
    return (
      <div id="editor" style={s.EditorStyle}>
      </div>
    )
  }

  _onChange() {
    const value = this.editor.getValue();
    const setting = assign({}, this.props, { text: value })
    SettingActions.updateSetting(setting)
  }
}

Editor.propTypes = {
  id: React.PropTypes.number,
  target: React.PropTypes.string,
  title: React.PropTypes.string,
  text: React.PropTypes.string
}
