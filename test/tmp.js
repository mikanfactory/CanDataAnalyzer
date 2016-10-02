// eslint-env node, mocha
// global check, gen

import { assert } from "chai"
import * as u from "../client/app/utils/tmp"
import * as p from "eulalie"

describe("factor", () => {
  const f1 = "BrakeOnOff"
  it("matches a feature", () => {
    const s1 = p.stream(f1)
    const r1 = p.parse(u.factor, s1)
    assert.isOk(p.isResult(r1), "parse output is not ParseResult")
  })
})

describe("term", () => {
  const t1 = "SpeedPerHourLowpass > 50 && (BrakeOnOff == 1 || AcceleratorOnOff == 1)"
  const t2 = "(BrakeOnOff == 1 || AcceleratorOnOff == 1) && SpeedPerHourLowpass > 50"
  it("matches a term", () => {
    const s1 = p.stream(t1)
    const r1 = p.parse(u.expr1, s1)
    assert.isOk(p.isResult(r1), "parse output is not ParseResult")
  })
  it("matches a term", () => {
    const s2 = p.stream(t2)
    const r2 = p.parse(u.expr1, s2)
    assert.isOk(p.isResult(r2), "parse output is not ParseResult")
  })
})

describe("bracket", () => {
  const b1 = "(BrakeOnOff == 1)"
  it("matches a bracket expr", () => {
    const s1 = p.stream(b1)
    const r1 = p.parse(u.bracketExpr1, s1)
    assert.isOk(p.isResult(r1), "parse output is not ParseResult")
  })
})

describe("convert", () => {
  const e1 = "SpeedPerHourLowpass > 50 && BrakeOnOff == 1"
  it("returns valid data structure", () => {
    const s1 = p.stream(e1)
    const r1 = p.parse(u.expr1, s1)
    assert.isOk(p.isResult(r1),  "parse output is not ParseResult")
    const exprs = [
      new Expr(1, "SpeedPerHourLowpass", ">", 50),
      new Expr(1, "BrakeOnOff", "==", 1)
    ]
    const expected = new Condition(1, "red", )
    assert.deepEqual(r1.value, expected)
  })
})
