import { Shipment } from "./Shipment";

export abstract class ShippingCostRule {
  // used mainly for testing cases
  [x: string]: any;
  abstract applyRule(shipment: Shipment): Shipment;
}
