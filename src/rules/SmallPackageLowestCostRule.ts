import { ShippingCostRule } from "../shared/ShippingCostRule";
import { Shipment } from "../shared/Shipment";
import { ShippingRule } from "../decorators/ShippingRule";
import { PackingSize } from "../enums";
import { ShipmentPricing } from "../repository/ShipmentPricing";

@ShippingRule
export class SmallPackageLowestCostRule extends ShippingCostRule {
  public applyRule(shipment: Shipment): Shipment {
    if (shipment.packageSizeCode === PackingSize.Small) {
      const shipmentPricingData = new ShipmentPricing().getLowestPrice(
        shipment.packageSizeCode
      );
      // Don't change the shipment object if price stays the same but different provider was selected
      if (
        shipment.shippingCost == shipmentPricingData.price &&
        shipment.shipmentProviderCode !==
          shipmentPricingData.shippingProviderCode
      ) {
        return shipment;
      }
      shipment.shipmentProviderCode = shipmentPricingData.shippingProviderCode;
      shipment.shippingCost = shipmentPricingData.price;
      shipment.shippingDiscount =
        shipment.shippingCost - shipmentPricingData.price;
    }
    return shipment;
  }
}
