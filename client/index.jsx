import React from 'react';
import ReactDOM from 'react-dom';
import Container from './app/Container';

const style = {
  width: '100%',
  height: '100%',
  position: 'relative'
}

ReactDOM.render(
  <Container style={style} />,
  document.getElementById('app')
)
