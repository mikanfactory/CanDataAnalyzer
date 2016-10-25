import { defaultDivideSize } from '../constants/AppConstants'

let clusterColors = [
  "#FFFFFF",
  "#ff0000",
  "#ffa500",
  "#ffff00",
  "#008000",
  "#00ffff",
  "#0000ff",
  "#800080"
]

let cluster13Colors = [
  "#FFFFFF",
  "#f39700",
  "#e60012",
  "#9caeb7",
  "#00a7db",
  "#009944",
  "#d7c447",
  "#967cb6",
  "#00ada9",
  "#bb641d",
  "#e85298",
  "#0079c2",
  "#6cbb5a",
  "#b6007a"
]

export function createRectangle(gMap, bounds) {
  return new window.google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0,
    bounds: bounds,
    map: gMap,
    draggable: true,
    editable: true
  })
}

export function createRectangles(gMap, gridPoints) {
  return gridPoints.map( row =>
    row.map( bounds =>
      new window.google.maps.Rectangle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFF',
        fillOpacity: 0,
        map: gMap,
        bounds: bounds
      })
    )
  )
}

export function createColoredRectangles(gMap, gridPoints, clusters) {
  const divideSize = gridPoints.length
  return gridPoints.map( (row, i) =>
    row.map( (bounds, j) => {
      const cluster = clusters[i*divideSize+j]
      return new window.google.maps.Rectangle({
        strokeColor: '#000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: clusterColors[cluster],
        fillOpacity: 0.5,
        map: gMap,
        bounds: bounds
      })
    })
  )
}

export function createGridPoints(bounds, divideSize) {
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

export function getSmallerBounds(gMap) {
  const bounds = gMap.getBounds()
  const NE = bounds.getNorthEast()
  const SW = bounds.getSouthWest()

  const dividerWidth = {
    lat: (NE.lat() - SW.lat())/(defaultDivideSize*2),
    lng: (NE.lng() - SW.lng())/(defaultDivideSize*2)
  }

  const newNE = {
    lat: NE.lat() - dividerWidth.lat,
    lng: NE.lng() - dividerWidth.lng
  }

  const newSW = {
    lat: SW.lat() + dividerWidth.lat,
    lng: SW.lng() + dividerWidth.lng
  }

  return new window.google.maps.LatLngBounds(newSW, newNE)
}

export function createGridSetting(bounds, divideSize) {
  const NE = bounds.getNorthEast()
  const SW = bounds.getSouthWest()

  return {
    divideSize: divideSize,
    NorthEast: { lat: NE.lat(), lng: NE.lng() },
    SouthWest: { lat: SW.lat(), lng: SW.lng() },
  }
}
