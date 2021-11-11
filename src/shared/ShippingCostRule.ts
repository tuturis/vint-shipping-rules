import { Shipment } from "./Shipment";

export abstract class ShippingCostRule {
  public abstract applyRule(shipment: Shipment): Shipment;
}
