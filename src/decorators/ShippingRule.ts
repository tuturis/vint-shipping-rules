import { ShippingRulesStorage } from "../shared/ShippingRulesStorage";

export function ShippingRule<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  ShippingRulesStorage.addRule(constructor.name, constructor);
}
