import { ShippingRule } from "../decorators";
import { ShipmentsDiscountRepository } from "../repository/ShipmentDiscounts";
import { Shipment, ShippingCostRule } from "../shared";

/**
 * - Accumulated discounts cannot exceed 10 € in a calendar month. If there are not enough funds to fully
 * cover a discount this calendar month, it should be covered partially.
 */
@ShippingRule
export class DiscountAccumulation implements ShippingCostRule {
  public applyRule(shipment: Shipment): Shipment {
    if (
      ShipmentsDiscountRepository.getMonthlyDiscountAmount(shipment) >= 1000 &&
      shipment.shippingDiscount > 0
    ) {
      console.log(
        "DiscountAccumulation: Discounts cannot exceed 10€ in a month, reverting all discounts"
      );
      const appliedRules = shipment.getAppliedRules();
      appliedRules.forEach((rule, key) => {
        const shipmentRuleSourceData = rule.get("source");
        if (shipmentRuleSourceData?.shippingDiscount === 0) {
          shipment.shippingDiscount = 0;
          shipment.shipmentProviderCode =
            shipmentRuleSourceData.shipmentProviderCode;
          shipment.packageSizeCode = shipmentRuleSourceData.packageSizeCode;
          shipment.shippingCost = shipmentRuleSourceData.shippingCost;
        }
      });
    }
    ShipmentsDiscountRepository.incrementMonthlyDiscountAmount(shipment);
    return shipment;
  }
}
