import * as p from 'eulalie'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'

class ASTNode {
  constructor(name, data, left, right) {
    this.name = name
    this.data = data
    this.left = left
    this.right = right
  }
}

function createCondition(id, LOPs, status) {
  return {
    id: id,
    LOPs: LOPs,
    status: status
  }
}

function createExpr(id, feature, operator, value) {
  return {
    conditionID: id,
    feature: feature,
    operator: operator,
    value: value
  }
}

export function toJSON(node) {
  let [left, right] = [undefined, undefined]
  if (node.name === "Condition") {
    return [{
      feature: node.left,
      operator: node.data,
      value: node.right
    }]
  }

  if (node.name === "Default") {
    return [{
      feature: node.data,
      operator: "",
      value: 0
    }]
  }

  if (node.left) {
    left = toJSON(node.left)
  }

  if (node.right) {
    right = toJSON(node.right)
  }

  return compact(flatten([left, right]))
}

export function getLOPs(node) {
  let [data, left, right] = [undefined, undefined, undefined]
  if (node.left && (node.left.name === "Conditions" || node.left.name === "Bracket")) {
    left = node.left.data
  }

  if (node.right && (node.right.name === "Conditions" || node.right.name === "Bracket")) {
    right = node.right.data
  }

  if (node.name !== "Default" && node.name !== "Condition") {
    data = node.data
  }

  return compact([left, right, data])
}

export function parseAll(text) {
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

  if (expr2.name === "Bracket") {
    return new ASTNode("Conditions", lop, expr2, expr1)
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

  return new ASTNode("Default", "default", "", 0)
}), "a default line")

export const returnLine = p.expected(p.seq(function*() {
  yield p.spaces
  yield p.string("return")
  yield p.spaces1
  const {value: image} = yield p.many1(p.alphanum)
  yield p.spaces

  return image
}), "a return line")

export const conditionBlock = p.expected(p.seq(function*() {
  const {value: ast} = yield p.either([defaultLine, caseLine])
  const {value: image} = yield returnLine

  const exprs = toJSON(ast)
  const LOPs = getLOPs(ast)
  return { exprs: exprs, LOPs: LOPs, status: image }
}), "a pair of case or default line and return line")

export const switchSentence = p.expected(p.seq(function*() {
  yield p.string("switch (true) {")
  yield eol
  yield p.spaces
  const {value: results} = yield p.many1A(conditionBlock)
  yield p.maybe(eol)
  yield p.string("}")

  return results.reduce( (acc, res, id) => {
    const { exprs, LOPs, status } = res
    const cond = createCondition(id, LOPs, status)
    const newExprs = exprs.map( expr => {
      return createExpr(id, expr.feature, expr.operator, expr.value)
    })
    return {
      conditions: [...acc.conditions, cond],
      expressions: [...acc.expressions, ...newExprs]
    }
  }, { conditions: [], expressions: [] })
}), "a switch sentence")
