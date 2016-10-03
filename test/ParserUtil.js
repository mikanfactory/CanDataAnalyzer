// eslint-env node, mocha
// global check, gen

import { assert } from "chai"
import * as u from "../client/app/utils/AppParserUtil"
import * as p from "eulalie"

function replaceOperator(expr) {
  return expr.replace("&&", "AND").replace("||", "OR")
}

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

describe("test", () => {
  it("matches test", () => {
    const s1 = p.stream("(Brake && Accel):")
    const r1 = p.parse(u.stmt, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.value, "(Brake && Accel)")
  })
})

describe("case line", () => {
  const c1 = "BrakeOnOff == 1"
  const c2 = "BrakeOnOff == 1 && AcceleratorOnOff == 0"
  const c3 = "BrakeOnOff == 1 || AcceleratorOnOff == 0"
  const c4 = "SpeedPerHourLowpass > 50 && (BrakeOnOff == 1 || AcceleratorOnOff == 1)"

  it("matches 1 condition", () => {
    const s1 = p.stream(`case ${c1}:\n`)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, c1)
  })
  it("matches 2 conditions (AND)", () => {
    const s1 = p.stream(`case ${c2}:\n`)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, replaceOperator(c2))
  })
  it("matches 2 conditions (OR)", () => {
    const s1 = p.stream(`case ${c3}:\n`)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, replaceOperator(c3))
  })
  it("matches complex conditions", () => {
    const s1 = p.stream(`case ${c4}:\n`)
    const r1 = p.parse(u.caseLine, s1)
    assert.deepEqual(r1.value, replaceOperator(c4))
  })
})

describe("default line", () => {
  it("matches default string and colon", () => {
    const s1 = p.stream("default:\n")
    const r1 = p.parse(u.defaultLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, "default")
  })
})

describe("return line", () => {
  it("matches return string and image", () => {
    const s1 = p.stream("return red\n")
    const r1 = p.parse(u.returnLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, "red")
  })
})

describe("conditionBlock", () => {
  const c1 = "Speed > 50 && (BrakeOnOff == 1 || AccelOnOff == 1)"
  const status = "red"
  const conditionBlock = `case ${c1}:
    return ${status}
`

  it("matches 1 block", () => {
    const s1 = p.stream(conditionBlock)
    const r1 = p.parse(u.conditionBlock, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, { content: replaceOperator(c1), status: status })
  })
})

describe("switchSentence", () => {
  const c1 = "Speed > 50 && (BrakeOnOff == 1 || AccelOnOff == 1)"
  const c2 = "Speed < 10"
  const c3 = "default"
  const status1 = "red"
  const status2 = "stop"
  const status3 = "none"
  const switchSentence = `switch (true) {
  case ${c1}:
    return ${status1}
  case ${c2}:
    return ${status2}
  ${c3}:
    return ${status3}
}`

  it("matches complex sentence", () => {
    const s1 = p.stream(switchSentence)
    const r1 = p.parse(u.switchSentence, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, [
      { id: 1, content: replaceOperator(c1), status: status1 },
      { id: 2, content: replaceOperator(c2), status: status2 },
      { id: 3, content: replaceOperator(c3), status: status3 }
    ])
  })
})
