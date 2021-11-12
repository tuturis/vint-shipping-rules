class ShippingRule {
  static instance: ShippingRule;
  static getInstance() {
    if (!ShippingRule.instance) {
      ShippingRule.instance = new ShippingRule();
    }
    return ShippingRule.instance;
  }

  private metadata: Map<Function, any> = new Map();

  public addRule(target: any, metadata: any) {
    this.metadata.set(target, metadata);
  }
  public getRule(target: any): any {
    return this.metadata.get(target);
  }
  public getRules(): Map<Function, any> {
    return this.metadata;
  }

  private constructor() {}
}
export const ShippingRulesStorage = ShippingRule.getInstance();
