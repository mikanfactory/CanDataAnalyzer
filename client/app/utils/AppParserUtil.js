import * as p from 'eulalie'

export const isEOL = (c) => /^\n$/.test(c)
export const eol = p.expected(p.sat(isEOL), "a EOL")
export const and = p.expected(p.string("&&"), "and operator")
export const or = p.expected(p.string("||"), "or operator")
export const eq = p.expected(p.string("=="), "equal operator")
export const neq = p.expected(p.string("!="), "not equal operator")
export const atLeast = p.expected(p.string(">="), "at least operator")
export const atMost = p.expected(p.string("<="), "at most operator")
export const greaterThan = p.expected(p.string(">"), "greater than operator")
export const lessThan = p.expected(p.string("<"), "less than operator")

export const logicalOp = p.either(and, or)
export const arithmeticOp = p.either([eq, neq, atLeast, atMost, greaterThan, lessThan])

const _condition = p.expected(p.seq(function*() {
  const {value: feature} = yield p.many1(p.alphanum)
  yield p.spaces1
  const {value: aop} = yield arithmeticOp
  yield p.spaces1
  const {value: val} = yield p.either(p.int, p.float)
  return { feature: feature, operator: aop, value: val }
}))

export const condition1 = p.expected(p.seq(function*() {
  const {value: c1} = yield _condition
  return { logics: [], details: [c1] }
}))

export const condition2 = p.expected(p.seq(function*() {
  const {value: c1} = yield _condition
  yield p.spaces1
  const {value: lop} = yield logicalOp
  yield p.spaces1
  const {value: c2} = yield _condition
  return { logics: [lop], details: [c1, c2] }
}))

export const condition3 = p.expected(p.seq(function*() {
  const {value: c12} = yield condition2
  yield p.spaces1
  const {value: op2} = yield logicalOp
  yield p.spaces1
  const {value: c3} = yield _condition

  const [op1, details] = [c12.logics[0], c12.details]
  return { logics: [op1, op2], details: [...details, c3] }
}))

export const conditions = p.expected(p.either([condition3, condition2, condition1]))

export const caseLine = p.expected(p.seq(function*() {
  yield p.string("case")
  yield p.spaces1
  const {value: s} = yield p.either(conditions, p.many1(p.alphanum))
  yield p.string(":")
  yield eol
  return s
}), "a case line")
