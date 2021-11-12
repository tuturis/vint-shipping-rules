import { ShippingCostRule } from "../shared/ShippingCostRule";
import { Shipment } from "../shared/Shipment";
import { ShippingRule } from "../decorators/ShippingRule";
import { PackingSize } from "../enums";
import { ShipmentPricingRepository } from "../repository/ShipmentPricing";

/**
 * Rule to calculate shipping cost for small package:
 * - All S shipments should always match the lowest S package price among the providers.
 */
@ShippingRule
export class SmallPackageLowestCostRule implements ShippingCostRule {
  public applyRule(shipment: Shipment): Shipment {
    if (shipment.packageSizeCode === PackingSize.Small) {
      const shipmentPricingData =
        ShipmentPricingRepository.getLowestPrice(shipment);
      if (
        shipment.shippingCost == shipmentPricingData.price &&
        shipment.shipmentProviderCode !==
          shipmentPricingData.shippingProviderCode
      ) {
        return shipment;
      }
      const discount =
        shipment.shippingDiscount +
        shipment.shippingCost -
        shipmentPricingData.price;
      shipment.shipmentProviderCode = shipmentPricingData.shippingProviderCode;
      shipment.shippingCost = shipmentPricingData.price;
      shipment.shippingDiscount = discount;
    }
    return shipment;
  }
}
