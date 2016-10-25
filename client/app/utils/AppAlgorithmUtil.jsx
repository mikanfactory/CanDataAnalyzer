import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import zip from 'lodash/zip'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import sortBy from 'lodash/sortBy'
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

export function createRiskHeatmap(gMap, gridPoints, risks) {
  const divideSize = gridPoints.length

  const wl = reduce(risks, function(acc, val, index) {
    if (val === 0) return [...acc, undefined]

    const [i, j] = _convertIndexToGrid(index, divideSize)
    const center = _getCenter(gridPoints[i][j])
    const wl = { location: center, weight: val }
    return [...acc, wl]
  }, [])

  return compact(wl)
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

/**
 * The {@link convertMarkersToHeatmapData} function returns a
 * useful data(statuses, weights) to creating Heatmap.
 * @arg {Array<Marker>} markers - The markers constructs heatmap.
 * @arg {Array<GridPoint>} gridPoint - The grid points contains position.
 */
export function convertMarkersToHeatmapData(markers, gridPoints) {
  let imageGroup = groupBy(markers, 'image')
  const divideSize = gridPoints.length

  const gwls = reduce(imageGroup, (acc, val, key) => {
    const xs = convertMarkersToGridIndices(val, gridPoints)
    const ys = convertIndicesToCounts(xs)
    acc[key] = _fillUnassignedIndex(ys, divideSize)
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

export function getGridPositions(gridPoints) {
  return flatten(gridPoints).map( gridPoint => {
    return _getCenter(gridPoint)
  })
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

function _fillUnassignedIndex(counts, divideSize) {
  let lst = Array(divideSize*divideSize).fill(0)

  forEach(counts, (val, key) => {
    lst[parseInt(key, 10)] = val
  })

  return lst
}
