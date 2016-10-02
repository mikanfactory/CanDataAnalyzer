import { FEATURES } from '../constants/AppConstants'
import * as p from 'eulalie'

const features = FEATURES.map( f => p.string(f) )

export class ASTNode {
  constructor(name, data, left, right) {
    this.name = name
    this.data = data
    this.left = left
    this.right = right
  }
}

export const isEOL = (c) => /^\n$/.test(c)
export const eol = p.expected(p.sat(isEOL), "a EOL")
export const _and = p.expected(p.string("&&"), "and operator")
export const _or = p.expected(p.string("||"), "or operator")
export const eq = p.expected(p.string("=="), "equal operator")
export const neq = p.expected(p.string("!="), "not equal operator")
export const atLeast = p.expected(p.string(">="), "at least operator")
export const atMost = p.expected(p.string("<="), "at most operator")
export const greaterThan = p.expected(p.string(">"), "greater than operator")
export const lessThan = p.expected(p.string("<"), "less than operator")

export const expr1 = p.seq(function*() {
  yield p.spaces
  const {value: e} = yield expr2
  yield p.spaces
  const {value: ops} = yield p.manyA(or)
  yield p.spaces

  return {expr: e, operators: ops}
})

export const or = p.seq(function*() {
  yield p.spaces
  const {value: op} = yield _or
  yield p.spaces
  const {value: e} = yield expr2
  yield p.spaces

  return {operator: op, expr: e}
})

export const expr2 = p.seq(function*() {
  yield p.spaces
  const {value: t} = yield term1
  yield p.spaces
  const {value: ops} = yield p.manyA(and)
  yield p.spaces

  return {term: t, operators: ops}
})

export const and = p.seq(function*() {
  yield p.spaces
  const {value: op} = yield _and
  yield p.spaces
  const {value: t} = yield term1
  yield p.spaces

  return {operator: op, term: t}
})

export const term1 = p.seq(function*() {
  yield p.spaces
  const {value: t} = yield term2
  yield p.spaces
  const {value: equivs} = yield p.manyA(equivalent)
  yield p.spaces

  return {term: t, operators: equivs}
})

export const equivalent = p.seq(function*() {
  yield p.spaces
  const {value: op} = yield p.either([eq, neq])
  yield p.spaces
  const {value: t} = yield term2
  yield p.spaces

  return {operator: op, term: t}
})

export const term2 = p.seq(function*() {
  yield p.spaces
  const {value: f} = yield factor
  yield p.spaces
  const {value: comps} = yield p.manyA(comparison)
  yield p.spaces

  return {factor: f, operators: comps}
})

export const comparison = p.seq(function*() {
  yield p.spaces
  const {value: op} = yield p.either([atLeast, atMost, greaterThan, lessThan])
  yield p.spaces
  const {value: f} = yield factor
  yield p.spaces

  return {operator: op, factor: f}
})

export const identifier = p.either([...features, p.float, p.int])

export const bracketExpr1 = p.seq(function*() {
  yield p.char("(")
  const {value: e} = yield expr1
  yield p.char(")")

  return e
})

export const factor = p.either(identifier, bracketExpr1)
