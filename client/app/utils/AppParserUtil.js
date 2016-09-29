import * as p from 'eulalie'

class ASTNode {
  constructor(name, data, left, right) {
    this.name = name
    this.data = data
    this.left = left
    this.right = right
  }
}

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
  return new ASTNode("Condition", aop, feature, value)
}))

const _conditions = p.expected(p.seq(function*() {
  const {value: expr1} = yield _condition1
  yield p.spaces1
  const {value: lop} = yield LOP
  yield p.spaces1
  const {value: expr2} = yield expr

  if (expr2.name === "Conditions") {
    let left = new ASTNode("Conditions", lop, expr1, expr2.left)
    return new ASTNode("Conditions", expr2.data, left, expr2.right)
  }

  return new ASTNode("Conditions", lop, expr1, expr2)
}), "one or more conditions")

const _bracket = p.expected(p.seq(function*() {
  yield p.char("(")
  yield p.spaces
  const {value: expr1} = yield _condition1
  yield p.spaces1
  const {value: lop} = yield LOP
  yield p.spaces1
  const {value: expr2} = yield expr
  yield p.spaces
  yield p.char(")")

  return new ASTNode("Bracket", lop, expr1, expr2)
}), "a condition included in ()")

export const expr = p.expected(p.either([_bracket, _conditions, _condition1]),
                               "one or more expressions")

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
