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

export const LOP = p.expected(p.either(and, or), "a logical operator")
export const AOP = p.expected(p.either([eq, neq, atLeast, atMost, greaterThan, lessThan]),
                              "a arithmetic operator")

const _condition1 = p.expected(p.seq(function*() {
  const {value: feature} = yield p.many1(p.alphanum)
  yield p.spaces1
  const {value: aop} = yield AOP
  yield p.spaces1
  const {value: value} = yield p.either(p.float, p.int)
  return { data: aop, left: feature, right: value }
}))

const _conditions = p.expected(p.seq(function*() {
  const {value: expr2} = yield _condition1
  yield p.spaces1
  const {value: lop} = yield LOP
  yield p.spaces1
  const {value: expr1} = yield p.either(_conditions, _condition1)

  return { data: lop, left: expr1, right: expr2 }
}), "one or more conditions")

/* const _bracket = p.expected(p.seq(function*() {
 *   yield p.string("(")
 *   const {value: conditions} = yield expr
 *   yield p.string(")")
 *
 *   return conditions
 * }), "a expr included in bracket")*/

export const expr = p.expected(p.either([_conditions, _condition1]), "one or more expressions")

export const caseLine = p.expected(p.seq(function*() {
  yield p.string("case")
  yield p.spaces1
  const {value: ast} = yield expr
  yield p.string(":")
  yield eol
  return ast
}), "a case line")

export const defaultLine = p.expected(p.seq(function*() {
  yield p.string("default:")
  yield eol

  return "default"
}), "a default line")

export const returnLine = p.expected(p.seq(function*() {
  yield p.spaces
  yield p.string("return")
  yield p.spaces1
  const {value: image} = yield p.many1(p.alphanum)
  yield p.spaces
  return image
}), "a return line")
