import { Shipment } from "./Shipment";

export abstract class ShippingCostRule {
  abstract applyRule(shipment: Shipment): Shipment;
}
