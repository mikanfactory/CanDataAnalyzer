import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMap from './app/GoogleMap';
import AnalysisToolBox from './app/AnalysisToolBox';

ReactDOM.render(
  <GoogleMap />,
  document.getElementById('gmap')
)

ReactDOM.render(
  <AnalysisToolBox />,
  document.getElementById('content')
);
