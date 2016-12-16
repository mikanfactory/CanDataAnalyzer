import { defaultDivideSize } from '../constants/AppConstants'

let clusterColors = [
  "#FFFFFF",
  "#FE2400",
  "#EC2127",
  "#D21E4E",
  "#B21D72",
  "#951E93",
  "#7421B1",
  "#5023D0",
  "#3025EA",
  "#082EFD",
  "#1147CE",
  "#247395",
  "#389D51",
  "#49C900",
  "#81D503",
  "#AFE400",
  "#DAF201",
  "#FFFF01",
  "#FEE600",
  "#FECD02",
  "#FEAF07",
  "#FF9400",
  "#FE7701",
  "#FD5800",
  "#FF3900",
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
