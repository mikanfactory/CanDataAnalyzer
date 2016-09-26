function createRectangle(bounds) {
  return new window.google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0,
    bounds: bounds,
    draggable: true,
    editable: true
  })
}

function createRectangles(gridPoints) {
  return gridPoints.map( row =>
    row.map( bounds =>
      new window.google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFF',
        fillOpacity: 0,
        bounds: bounds
      })
    )
  )
}

function createGridPoints(bounds, divideSize) {
  const NE = bounds.getNorthEast()
  const SW = bounds.getSouthWest()

  const dividerWidth = {
    lat: (NE.lat() - SW.lat())/divideSize,
    lng: (NE.lng() - SW.lng())/divideSize
  }

  return [...Array(divideSize).keys()].map( i =>
    [...Array(divideSize).keys()].map( j => ({
      north: NE.lat() - dividerWidth.lat*i,
      south: NE.lat() - dividerWidth.lat*(i+1),
      east:  NE.lng() - dividerWidth.lng*j,
      west:  NE.lng() - dividerWidth.lng*(j+1)
    }))
  )
}

export { createRectangle, createRectangles, createGridPoints }
