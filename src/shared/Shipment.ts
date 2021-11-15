import { Transform, TransformCallback } from "stream";

import { PackingSize, ShippingProvider } from "../enums";
import { ShipmentPricingRepository } from "../repository/ShipmentPricing";
import { ShippingRulesStorage } from "./ShippingRulesStorage";

type AppliedRules = Map<string, Map<"source" | "target", Shipment>>;
export class Shipment extends Transform {
  constructor() {
    super();
  }
  _transform = (
    chunk: string,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) => {
    const shipment = new Shipment();
    shipment.fromString(chunk, " ");
    if (shipment.validate()) {
      shipment.applyShippingRates();
      shipment.applyShippingRules();
    }
    this.push(shipment.toString());
    callback();
  };

  private _appliedRules: AppliedRules = new Map();

  date!: Date;
  shipmentProviderCode!: ShippingProvider;
  packageSizeCode!: PackingSize;
  shippingCost: number = Infinity;
  shippingDiscount: number = 0;

  get appliedRules(): AppliedRules {
    return this._appliedRules;
  }
  public addAppliedRule(ruleName: string, source: Shipment, target: Shipment) {
    const value = new Map();
    value.set("source", source);
    value.set("target", target);
    this._appliedRules.set(ruleName, value);
  }

  public applyShippingRates() {
    this.shippingCost = ShipmentPricingRepository.getPrice(this);
  }

  public applyShippingRules() {
    let shippingRules = ShippingRulesStorage.getRules();

    shippingRules.forEach((shippingRule) => {
      const shipmentWithRulesApplied = shippingRule[1].applyRule(this);
      Object.assign(this, shipmentWithRulesApplied);
    });
  }

  public validate(): boolean {
    if (
      this.date === undefined ||
      this.shipmentProviderCode === undefined ||
      this.packageSizeCode === undefined
    ) {
      return false;
    }
    return true;
  }

  public fromString(str: string, delimiter = " "): Shipment {
    const [date, packageSizeCode, shipmentProviderCode] = str.split(delimiter);
    if (Date.parse(date)) {
      this.date = new Date(date);
    }
    this.shipmentProviderCode =
      (shipmentProviderCode as ShippingProvider) || undefined;
    this.packageSizeCode = (packageSizeCode as PackingSize) || undefined;
    return this;
  }

  public toString(delimiter = " "): string {
    const date = this.date?.toISOString().slice(0, 10);
    const shippingDiscount =
      this.shippingDiscount === 0
        ? "-"
        : (this.shippingDiscount / 100).toFixed(2);

    const shippingCost =
      this.shippingCost === Infinity
        ? Infinity
        : (this.shippingCost / 100).toFixed(2);

    const dateValue = this.date === undefined ? "Ignored" : date;
    const packageSizeCodeValue =
      this.packageSizeCode === undefined ? "Ignored" : this.packageSizeCode;
    const shipmentProviderCodeValue =
      this.shipmentProviderCode === undefined
        ? "Ignored"
        : this.shipmentProviderCode;
    const shippingCostValue =
      shippingCost === Infinity ? "Ignored" : shippingCost;
    if (
      packageSizeCodeValue === "Ignored" ||
      shipmentProviderCodeValue === "Ignored"
    ) {
      return `${dateValue}${delimiter}${packageSizeCodeValue}${delimiter}${shipmentProviderCodeValue}\n`;
    }
    return `${dateValue}${delimiter}${packageSizeCodeValue}${delimiter}${shipmentProviderCodeValue}${delimiter}${shippingCostValue}${delimiter}${shippingDiscount}\n`;
  }
}
