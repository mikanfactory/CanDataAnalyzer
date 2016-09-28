import * as p from 'eulalie'

export function switchParser(text) {
  const input = p.stream(text)
  const parser = p.seq(function*() {
    yield p.string("switch")
    yield p.space
    yield p.string("(")
    const {value: exp} = yield p.many1(p.letter)
    yield p.string(")")
    yield p.space
    return exp
  })
  return p.parse(parser, input)
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

export const logicalOp = p.either(and, or)
export const arithmeticOp = p.either([eq, neq, atLeast, atMost, greaterThan, lessThan])
