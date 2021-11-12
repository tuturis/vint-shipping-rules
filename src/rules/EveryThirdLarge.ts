import { ShippingRule } from "../decorators";
import { ShipmentsRepository } from "../repository/Shipments";
import { Shipment, ShippingCostRule } from "../shared";

/**
 *  - The third L shipment via LP should be free,
 *  but only once a calendar month.
 */

@ShippingRule
export class EveryThirdLarge implements ShippingCostRule {
  public applyRule(shipment: Shipment): Shipment {
    const {
      shipmentProviderCode,
      packageSizeCode,
      shippingCost,
      shippingDiscount,
    } = shipment;
    // probably would be better if incremented somewhere else
    ShipmentsRepository.incrementMonthlyShipments(shipment);
    if (
      shipmentProviderCode === "LP" &&
      packageSizeCode === "L" &&
      ShipmentsRepository.monthlyShipmentCount(shipment) === 3
    ) {
      shipment.shippingDiscount = shippingDiscount + shippingCost;
      shipment.shippingCost = 0;
    }
    return shipment;
  }
}
