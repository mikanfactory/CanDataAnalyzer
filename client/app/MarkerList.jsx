import React from 'react'
import Marker from './Marker'

export default class MarkerList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="MarkerList">
        <Marker />
      </div>
    )
  }
}
