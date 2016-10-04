import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import zip from 'lodash/zip'
import flatten from 'lodash/flatten'

//
// process image
//
// [<Markers>, ...]
// apply: convertMarkersToGridIndices
// -> [{ index: 0 }, { index: 10 }, ...]
// apply: groupBy
// -> { '0': [{ index: 0 }, { index: 0 }], '1': [...], ... }
// apply: counts
// -> { '0': 2, '1': 10, ... }
// apply: convertCountsToWeightedLocations
// -> [{ location: LatLng, weight: number }, ...]
//

export function convertMarkersToWeightedLocations(markers, gridPoints) {
  const xs = convertMarkersToGridIndices(markers, gridPoints)
  const ys = convertIndicesToCounts(xs)
  return convertCountsToWeightedLocations(ys, gridPoints)
}

export function convertMarkersToGridIndices(markers, gridPoints) {
  return markers.map( m => findGridIndex(m, gridPoints) )
}

export function convertIndicesToCounts(indices) {
  const xs = groupBy(indices, 'index')
  return reduce(xs, function(acc, val, key) {
    acc[key] = val.length
    return acc
  }, {})
}

function convertCountsToWeightedLocations(counts, gridPoints) {
  const divideSize = gridPoints.length

  return reduce(counts, function(acc, val, key) {
    const [i, j] = _convertIndexToGrid(parseInt(key, 10), divideSize)
    const center = _getCenter(gridPoints[i][j])
    const wl = { location: center, weight: val }
    return [...acc, wl]
  }, [])
}

export function findGridIndex(marker, gridPoints) {
  const divideSize = gridPoints.length

  for (let i = 0; i < divideSize; i++) {
    const bounds = gridPoints[i][0]
    if (bounds.south > marker.position.lat) {
      continue
    }
    for (let j = 0; j < divideSize; j++) {
      const bounds = gridPoints[i][j]
      if (bounds.west <= marker.position.lng) {
        return { index: i*divideSize + j }
      }
    }
  }
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



/**
 * The {@link convertMarkersToHeatmapData} function returns a
 * useful data(statuses, weights) to creating Heatmap.
 * @arg {Array<Marker>} markers - The markers constructs heatmap.
 * @arg {Array<GridPoint>} gridPoint - The grid points contains position.
 *
 */
export function convertMarkersToHeatmapData(markers, gridPoints) {
  let imageGroup = groupBy(markers, 'image')
  const gwls = reduce(imageGroup, (acc, val, key) => {
    const xs = convertMarkersToGridIndices(markers, gridPoints)
    const ys = convertIndicesToCounts(xs)
    acc[key] = reduce(ys, (acc, val) => {
      return [...acc, val]
    }, [])
    return acc
  }, {})

  const weights = reduce(gwls, (acc, val) => {
    return [...acc, val]
  }, [])

  return {
    statuses: Object.keys(gwls),
    weights: zip(...weights)
  }
}
