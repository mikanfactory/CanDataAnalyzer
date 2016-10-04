import React from 'react'
import ace from 'brace'
import { EditorStyle as s } from './Styles'
import { FEATURES } from '../constants/AppConstants'

import 'brace/theme/textmate'
import 'brace/mode/javascript'
import 'brace/keybinding/emacs'
import 'brace/ext/language_tools'

import SettingActions from '../actions/SettingActions'

export default class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.editor = {}
    this.dictonary = FEATURES.map( f => ({
      value: f, score: 1000, match: "custom"
    }))
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
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
  }

  render() {
    return (
      <div id="editor" style={s.EditorStyle}>
      </div>
    )
  }
}

Editor.propTypes = {
  text: React.PropTypes.string
}
