import { ShippingCostRule } from "../shared";
import { ShippingRulesStorage } from "../shared/ShippingRulesStorage";

type ShippingRuleDecorator = <T extends { new (): ShippingCostRule }>(
  target: T
) => void;

export type ShippingRuleOptions = {
  appliesAfter?: "afterAll";
};
export function ShippingRule(
  options: ShippingRuleOptions = {}
): ShippingRuleDecorator {
  return (target) => {
    ShippingRulesStorage.addRule(
      target.constructor.name,
      new target(),
      options
    );
  };
}
