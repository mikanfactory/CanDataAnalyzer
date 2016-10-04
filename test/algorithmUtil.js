// eslint-env node, mocha
// global check, gen

import { assert } from "chai"
import * as u from "../client/app/utils/AppAlgorithmUtil"

const GRID_SIZE = 10

function _getPosition(i) {
  return { lat: i/GRID_SIZE, lng: i%GRID_SIZE + 0.1 }
}

function _getDummyMarker() {
  return [...Array(GRID_SIZE*10).keys()].map( i =>
    ({
      id: i,
      settingID: i/GRID_SIZE,
      image: i%10==0 ? "red" : "green",
      position: _getPosition(i),
      description: "TEST"
    })
  )
}

function _getDummyGridPoints() {
  return [...Array(GRID_SIZE).keys()].map ( i =>
    [...Array(GRID_SIZE).keys()].map( j =>
      ({
        north: GRID_SIZE - i,
        south: GRID_SIZE - (i+1),
        east:  GRID_SIZE - j,
        west:  GRID_SIZE - (j+1)
      })
    )
  )
}

function toString(position) {
  return `{lat: ${position.lat}, lng: ${position.lng}}`
}

describe('findGridIndex', () => {
  it('returns valid index', () => {
    const markers = _getDummyMarker()
    const gridPoints = _getDummyGridPoints()

    const [m1, m2, m3] = [markers[0], markers[1], markers[10]]
    const [e1, e2, e3] = [{index: 99}, {index: 98}, {index: 89}]

    assert.deepEqual(e1, u.findGridIndex(m1, gridPoints),
                     `marker: ${toString(m1.position)}`
    )

    assert.deepEqual(e2, u.findGridIndex(m2, gridPoints),
                     `marker: ${toString(m2.position)}`
    )

    assert.deepEqual(e3, u.findGridIndex(m3, gridPoints),
                     `marker: ${toString(m3.position)}`
    )
  })
})

describe('convertMarkersToGridIndices', () => {
  it('returns valid index list', () => {
    const expected = [...Array(100).keys()].map( i => ({ index: i })).reverse()
    const actual = u.convertMarkersToGridIndices(_getDummyMarker(), _getDummyGridPoints())
    assert.deepEqual(expected, actual)
  })
})

describe('convertIndicesToCounts', () => {
  it('returns valid hash', () => {
    const expected = [...Array(100).keys()].reduce( (acc, val) => {
      acc[val] = 1
      return acc
    }, {})
    const indices = u.convertMarkersToGridIndices(_getDummyMarker(), _getDummyGridPoints())
    const actual = u.convertIndicesToCounts(indices)
    assert.deepEqual(expected, actual)
  })
})

describe('convertMarkersToHeatmapData', () => {
  it('divided to some group', () => {
    const actual = u.convertMarkersToHeatmapData(
      _getDummyMarker(), _getDummyGridPoints())

    assert.deepEqual(actual.statuses.length, 2)
    assert.deepEqual(actual.statuses, ['red', 'green'])
    assert.deepEqual(actual.weights.length, 100)
    assert.deepEqual(actual.weights[0].length, 2)
    assert.deepEqual(actual.weights[0], [0, 1])
    assert.deepEqual(actual.weights[9], [1, 0])
  })
})
