export class Condition {
  constructor(feature, aop, value) {
    this.name = "Condition"
    this.feature = feature
    this.aop = aop
    this.value = value
    Object.freeze()
  }
}

export class ConditionWithLOP {
  constructor(lop, condition) {
    this.name = "ConditionWithLOP"
    this.lop = lop
    this.condition = condition
    Object.freeze()
  }
}

export function isCondition(o) {
  return o.hasOwnProperty("name") && o.name === "Condition"
}

export function isConditionWithLOP(o) {
  return o.hasOwnProperty("name") && o.name === "ConditionWithLOP"
}
