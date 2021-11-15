import { ShippingRule } from "../decorators";
import { ShipmentsDiscountRepository } from "../repository/ShipmentDiscounts";
import { Shipment, ShippingCostRule } from "../shared";

/**
 * - Accumulated discounts cannot exceed 10 € in a calendar month.
 *  If there are not enough funds to fully
 * cover a discount this calendar month, it should be covered partially.
 */
@ShippingRule({ appliesAfter: "afterAll" })
export class DiscountAccumulation implements ShippingCostRule {
  monthlyDiscountLimit = 1000;

  public applyRule(shipment: Shipment): Shipment {
    const { shippingDiscount, shippingCost } = shipment;
    const totalMonthlyDiscount =
      ShipmentsDiscountRepository.getMonthlyDiscountAmount(shipment);

    if (
      totalMonthlyDiscount >= this.monthlyDiscountLimit &&
      shippingDiscount > 0
    ) {
      const appliedRules = shipment.appliedRules;
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
      return shipment;
    }

    if (totalMonthlyDiscount + shippingDiscount >= this.monthlyDiscountLimit) {
      const discountToDistribute =
        totalMonthlyDiscount + shippingDiscount - this.monthlyDiscountLimit;

      shipment.shippingDiscount = shippingDiscount - discountToDistribute;
      shipment.shippingCost = shippingCost + discountToDistribute;
    }

    ShipmentsDiscountRepository.incrementMonthlyDiscountAmount(shipment);
    return shipment;
  }
}
