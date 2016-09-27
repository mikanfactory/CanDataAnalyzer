import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'

//
// process image
//
// [<Markers>, ...]
// apply: convertMarkersToGridIndices
// -> [{ index: 0 }, ...]
// apply: groupBy
// -> { '0': [{ index: 0 }, ... ], '1': [...], ... }
// apply: counts
// -> { '0': 2, '1': 10, ... }
// apply: convertCountsToWeightedLocations
// -> [{ location: LatLng, weight: number }, ...]
//

function _convertMarkersToGridIndices(markers, gridPoints) {
  return markers.map( m => _findGridIndex(m, gridPoints) )
}

function _convertIndicesToCounts(indices) {
  const xs = groupBy(indices, 'index')
  return reduce(xs, function(acc, val, key) {
    acc[key] = val.length
    return acc
  }, {})
}

function _convertCountsToWeightedLocations(counts, gridPoints) {
  const divideSize = gridPoints.length

  return reduce(counts, function(acc, val, key) {
    const [i, j] = _convertIndexToGrid(parseInt(key, 10), divideSize)
    const center = _getCenter(gridPoints[i][j])
    const wl = { location: center, weight: val }
    return [...acc, wl]
  }, [])
}

function _findGridIndex(marker, gridPoints) {
  const divideSize = gridPoints.length

  for (let i = 0; i < divideSize; i++) {
    const bounds = gridPoints[i][0]
    if (bounds.south > marker.position.lat) {
      continue
    }
    for (let j = 0; j < divideSize; j++) {
      const bounds = gridPoints[i][j]
      if (bounds.west < marker.position.lng) {
        return { index: i*divideSize + j }
      }
    }
  }

  throw new Error("Couldn't find index of the grid!!")
}

function _convertIndexToGrid(index, divideSize) {
  const i = Math.floor(index / divideSize)
  const j = index % divideSize
  return [i, j]
}

function _getCenter(gridPoint) {
  const lat = (gridPoint.north + gridPoint.south)/2
  const lng = (gridPoint.east + gridPoint.west)/2
  return new window.google.maps.LatLng({ lat: lat, lng: lng })
}

function convertMarkersToWeightedLocations(markers, gridPoints) {
  const xs = _convertMarkersToGridIndices(markers, gridPoints)
  const ys = _convertIndicesToCounts(xs)
  return _convertCountsToWeightedLocations(ys, gridPoints)
}

export default convertMarkersToWeightedLocations
