import { ShippingCostRule } from ".";

class ShippingRule {
  static instance: ShippingRule;
  static getInstance() {
    if (!ShippingRule.instance) {
      ShippingRule.instance = new ShippingRule();
    }
    return ShippingRule.instance;
  }

  private metadata: Map<string, ShippingCostRule> = new Map();

  public addRule(target: string, metadata: ShippingCostRule) {
    this.metadata.set(target, metadata);
  }
  public getRule(target: string): ShippingCostRule | undefined {
    return this.metadata.get(target);
  }
  public getRules(): Map<string, ShippingCostRule> {
    return this.metadata;
  }

  private constructor() {}
}
export const ShippingRulesStorage = ShippingRule.getInstance();
