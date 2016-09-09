import React from 'react'
import MapActionMenu from './MapActionMenu'

export default class ATBHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="ATBHeader">
        CanDataAnalyzer
        <MapActionMenu />
      </div>
    )
  }
}
