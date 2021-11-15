import { Shipment, ShippingCostRule } from "../shared";
import { ShippingRulesStorage } from "../shared/ShippingRulesStorage";

type ShippingRuleDecorator = <T extends { new (): ShippingCostRule }>(
  target: T
) => void;

export type ShippingRuleOptions = {
  appliesAfter?: "afterAll";
};
const partialCopy = (shipment: Shipment): Shipment => {
  const copy = new Shipment();
  copy.date = shipment.date;
  copy.shipmentProviderCode = shipment.shipmentProviderCode;
  copy.packageSizeCode = shipment.packageSizeCode;
  copy.shippingCost = shipment.shippingCost;
  copy.shippingDiscount = shipment.shippingDiscount;
  return copy;
};

export function ShippingRule(
  options: ShippingRuleOptions = {}
): ShippingRuleDecorator {
  return (targetClass) => {
    const target = new targetClass();
    const ruleName = target.constructor.name;
    const originalMethod = target.applyRule;

    target.applyRule = function (args) {
      const source = partialCopy(args);
      const result = originalMethod.call(this, args);
      const target = partialCopy(result);
      result.addAppliedRule(ruleName, source, target);
      return result;
    };

    ShippingRulesStorage.addRule(ruleName, target, options);
  };
}
