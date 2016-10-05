import * as p from 'eulalie'
import assign from 'object-assign'
import compact from 'lodash/compact'
import flatten from 'lodash/flatten'

export const isEOL = (c) => /^\n$/.test(c)
export const eol = p.expected(p.sat(isEOL), "a EOL")

export const stmt = p.many1(p.notChar(":"))

export const caseLine = p.expected(p.seq(function*() {
  yield p.string("case")
  yield p.spaces1
  const {value: expr} = yield stmt
  yield p.string(":")
  yield eol

  return expr.replace("&&", "AND").replace("||", "OR")
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
  const {value: status} = yield p.many1(p.alphanum)
  yield p.spaces

  return status
}), "a return line")

export const conditionBlock = p.expected(p.seq(function*() {
  const {value: stmt} = yield p.either([defaultLine, caseLine])
  const {value: status} = yield returnLine

  return { content: stmt, status: status }
}), "a pair of case or default line and return line")

export const commentLine = p.expected(p.seq(function*() {
  yield p.string("//")
  yield p.many(p.notChar("\n"))
  yield eol

  return undefined
}))

export const switchSentence = p.expected(p.seq(function*() {
  yield p.string("switch (true) {")
  yield eol
  yield p.spaces
  const {value: conditions} = yield p.many1A(conditionBlock)
  yield p.maybe(eol)
  yield p.string("}")

  return conditions.map( (c, i) => {
    return assign({}, c, { id: i+1 })
  })
}), "a switch sentence")

export const whiteline = p.seq(function*() {
  yield eol
  return ""
})

export const parseAll = p.seq(function*() {
  const {value: result} = yield p.manyA(
    p.either([commentLine, whiteline, switchSentence]))

  return flatten(compact(result))
})
