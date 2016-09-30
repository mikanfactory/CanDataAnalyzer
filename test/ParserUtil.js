// eslint-env node, mocha
// global check, gen

import { assert } from "chai"
import * as u from "../client/app/utils/AppParserUtil"
import * as p from "eulalie"
import zip from 'lodash/zip'

class ASTNode {
  constructor(name, data, left, right) {
    this.name = name
    this.data = data
    this.left = left
    this.right = right
  }
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
    const r1 = p.parse(u.LOP, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.value, "&&")

    const s2 = p.stream("||")
    const r2 = p.parse(u.LOP, s2)
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
    const r1 = p.parse(u.AOP, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.equal(r1.value, "<=")

    const s2 = p.stream("!=")
    const r2 = p.parse(u.AOP, s2)
    assert.isOk(p.isResult(r2), "parser output is not ParseResult")
    assert.equal(r2.value, "!=")

    const s3 = p.stream("||")
    const r3 = p.parse(u.AOP, s3)
    assert.isOk(p.isError(r3), "parser output is not ParseError")
  })
})

describe("case line", () => {
  const brakeAST = new ASTNode("Condition", "==", "BrakeOnOff", 1)
  const accelAST = new ASTNode("Condition", "==", "AcceleratorOnOff", 0)
  const speedAST = new ASTNode("Condition", ">", "SpeedPerHourLowpass", 50)

  it("matches 1 condition", () => {
    const s1 = p.stream("case BrakeOnOff == 1:\n")
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, brakeAST)
  })
  it("matches 2 conditions", () => {
    const s1 = p.stream("case BrakeOnOff == 1 || AcceleratorOnOff == 0:\n")
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    const expected = new ASTNode(
      "Conditions",
      "||",
      brakeAST,
      accelAST
    )
    assert.deepEqual(r1.value, expected)
  })
  it("matches 3 conditions [&&, ||]", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "||",
      "BrakeOnOff == 1",
      "&&",
      "AcceleratorOnOff == 0:\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    const expected = new ASTNode(
      "Conditions",
      "&&",
      new ASTNode("Conditions", "||", speedAST, brakeAST),
      accelAST
    )
    assert.deepEqual(r1.value, expected)
  })
  it("matches 3 conditions [||, &&]", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "&&",
      "BrakeOnOff == 1",
      "||",
      "AcceleratorOnOff == 0:\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    const expected = new ASTNode(
      "Conditions",
      "||",
      new ASTNode("Conditions", "&&", speedAST, brakeAST),
      accelAST
    )
    assert.deepEqual(r1.value, expected)
  })
  it("matches complex conditions [&& (||)]", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "&&",
      "(BrakeOnOff == 1",
      "||",
      "AcceleratorOnOff == 0):\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    const expected = new ASTNode(
      "Conditions",
      "&&",
      new ASTNode("Bracket", "||", brakeAST, accelAST),
      speedAST
    )
    assert.deepEqual(r1.value, expected)
  })
})

describe("toJSON", () => {
  it("convert AST node to flatten expressions", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "||",
      "BrakeOnOff == 1",
      "&&",
      "AcceleratorOnOff == 0:\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")

    const fs = ["SpeedPerHourLowpass", "BrakeOnOff", "AcceleratorOnOff"]
    const os = [">", "==", "=="]
    const vs = [50, 1, 0]
    const expect = zip(fs, os, vs).map( (m) => {
      return { feature: m[0], operator: m[1], value: m[2] }
    })
    assert.deepEqual(u.toJSON(r1.value, 1), expect)
  })
  it("matches complex conditions [&& (||)]", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "&&",
      "(BrakeOnOff == 1",
      "||",
      "AcceleratorOnOff == 0):\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")

    const fs = ["BrakeOnOff", "AcceleratorOnOff", "SpeedPerHourLowpass"]
    const os = ["==", "==", ">"]
    const vs = [1, 0, 50]
    const expect = zip(fs, os, vs).map( (m) => {
      return { feature: m[0], operator: m[1], value: m[2] }
    })
    assert.deepEqual(u.toJSON(r1.value, 1), expect)
  })
})

describe("getLOPs", () => {
  it("returns logical operators", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "||",
      "BrakeOnOff == 1",
      "&&",
      "AcceleratorOnOff == 0:\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(u.getLOPs(r1.value), ["||", "&&"])
  })
  it("matches complex conditions [&& (||)]", () => {
    const str = [
      "case",
      "SpeedPerHourLowpass > 50",
      "&&",
      "(BrakeOnOff == 1",
      "||",
      "AcceleratorOnOff == 0):\n"
    ].join(" ")
    const s1 = p.stream(str)
    const r1 = p.parse(u.caseLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(u.getLOPs(r1.value), ["||", "&&"])
  })
})

describe("default line", () => {
  it("matches default string and colon", () => {
    const s1 = p.stream("default:\n")
    const r1 = p.parse(u.defaultLine, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, new ASTNode("Default", "default", "", 0))
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
  const oneCaseLine = `case BrakeOnOff == 1:
return red
`
  const defaultLine = `default:
return red
`
  it("matches default line", () => {
    const s1 = p.stream(defaultLine)
    const r1 = p.parse(u.conditionBlock, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, {
      exprs: [{
        feature: "default",
        operator: "",
        value: 0
      }],
      LOPs: [],
      status: "red"
    })
  })

  it("matches one case line", () => {
    const s1 = p.stream(oneCaseLine)
    const r1 = p.parse(u.conditionBlock, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")
    assert.deepEqual(r1.value, {
      exprs: [{
        feature: "BrakeOnOff",
        operator: "==",
        value: 1
      }],
      LOPs: [],
      status: "red"
    })
  })
})

describe("switchSentence", () => {
  const switchSentence = `switch (true) {
  case BrakeOnOff == 1:
    return red
  default:
    return green
}`

  const cond1 = {id: 0, LOPs: [], status: "red"}
  const cond2 = {id: 1, LOPs: [], status: "green"}
  const expr1 = {conditionID: 0, feature: "BrakeOnOff", operator: "==", value: 1}
  const expr2 = {conditionID: 1, feature: "default", operator: "", value: 0}

  it("matches one case line", () => {
    const s1 = p.stream(switchSentence)
    const r1 = p.parse(u.switchSentence, s1)
    assert.isOk(p.isResult(r1), "parser output is not ParseResult")

    assert.deepEqual(r1.value, {
      conditions: [cond1, cond2],
      expressions: [expr1, expr2]
    })
  })
})
