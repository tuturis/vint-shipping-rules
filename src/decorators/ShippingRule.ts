import { Shipment, ShippingCostRule } from "../shared";
import { ShippingRulesStorage } from "../shared/ShippingRulesStorage";

export function ShippingRule<T extends { new (): ShippingCostRule }>(
  constructor: T
) {
  // @TODO check is constructor is an singleton
  ShippingRulesStorage.addRule(constructor.name, new constructor());
}
