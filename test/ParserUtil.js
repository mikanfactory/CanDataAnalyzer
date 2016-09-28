// eslint-env node, mocha
// global check, gen

import { assert } from "chai"
import * as u from "../client/app/utils/AppParserUtil"
import * as p from "eulalie"

const validString =
  `switch (true)
case foo == 10 && bar === 20:
  return "blue"
case foo > 10:
return "red"
default:
return "green"
`

describe("EOL", () => {
  const eol1 = `
`
  const eol2 = "\n"

  it("returns true if \\n given", () => {
    assert.isOk(u.isEOL(eol1))
    assert.isOk(u.isEOL(eol2))
  });
  it("can parse some \n", () => {
    const s1 = p.stream(eol1)
    const r1 = p.parse(u.eol, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.matched, "\n")
    assert.equal(r1.value, "\n")

    const s2 = p.stream(eol2)
    const r2 = p.parse(u.eol, s2)
    assert.isOk(p.isResult(r2), "parser output is not ParseResult")
    assert.equal(r2.matched, "\n")
    assert.equal(r2.value, "\n")
  })
})

describe("Logical Operators", () => {
  it("and", () => {
    const s = p.stream("&&")
    const r = p.parse(u.and, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "&&")
  })
  it("or", () => {
    const s = p.stream("||")
    const r = p.parse(u.or, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "||")
  })
  it("logical oprerators", () => {
    const s1 = p.stream("&&")
    const r1 = p.parse(u.logicalOp, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.value, "&&")

    const s2 = p.stream("||")
    const r2 = p.parse(u.logicalOp, s2)
    assert.isOk(p.isResult(r2), "parser output is not ParseResult")
    assert.equal(r2.matched, "||")
  })
})

describe("Arithmetic Operators", () => {
  it("equal", () => {
    const s = p.stream("==")
    const r = p.parse(u.eq, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "==")
  })
  it("not equal", () => {
    const s = p.stream("!=")
    const r = p.parse(u.neq, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "!=")
  })
  it("at least", () => {
    const s = p.stream(">=")
    const r = p.parse(u.atLeast, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, ">=")
  })
  it("at most", () => {
    const s = p.stream("<=")
    const r = p.parse(u.atMost, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "<=")
  })
  it("greater than", () => {
    const s = p.stream(">")
    const r = p.parse(u.greaterThan, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, ">")
  })
  it("less than", () => {
    const s = p.stream("<")
    const r = p.parse(u.lessThan, s)
    assert.isOk(p.isResult(r), "parser output is not ParseResult")
    assert.equal(r.value, "<")
  })
  it("arithmetic operators", () => {
    const s1 = p.stream("<=")
    const r1 = p.parse(u.arithmeticOp, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.value, "<=")

    const s2 = p.stream("!=")
    const r2 = p.parse(u.arithmeticOp, s2)
    assert.isOk(p.isResult(r2), "parser output is not ParseResult")
    assert.equal(r2.value, "!=")

    const s3 = p.stream("||")
    const r3 = p.parse(u.arithmeticOp, s3)
    assert.isOk(p.isError(r3), "parser output is not ParseError")
  })
})
