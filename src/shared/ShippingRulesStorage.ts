import { equal } from "assert/strict";
import { ShippingCostRule } from ".";

class ShippingRule {
  static instance: ShippingRule;
  static getInstance() {
    if (!ShippingRule.instance) {
      ShippingRule.instance = new ShippingRule();
    }
    return ShippingRule.instance;
  }

  private metadata: [string, ShippingCostRule][] = [];

  public addRule(
    target: string,
    metadata: ShippingCostRule,
    { appliesAfter }: { appliesAfter?: "afterAll" } = {}
  ) {
    if (appliesAfter === "afterAll") {
      this.metadata.push([target, metadata]);
    } else {
      this.metadata.unshift([target, metadata]);
    }
  }
  public getRule(target: string): ShippingCostRule {
    const rule = this.metadata.find((rule) => rule[0] === target);
    if (!rule) {
      throw new Error(`ShippingRule: Rule for target ${target} not found`);
    }
    return rule[1];
  }
  public getRules() {
    return this.metadata;
  }

  private constructor() {}
}
export const ShippingRulesStorage = ShippingRule.getInstance();
