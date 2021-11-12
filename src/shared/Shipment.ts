import { PackingSize, ShippingProvider } from "../enums";
import { ShipmentPricingRepository } from "../repository/ShipmentPricing";
import { ShippingRulesStorage } from "./ShippingRulesStorage";

type AppliedRules = Map<string, Map<"source" | "target", Shipment>>;
export class Shipment {
  private ignore: boolean = false;
  private _appliedRules: AppliedRules = new Map();

  shippingCost: number = Infinity;
  shippingDiscount: number = 0;
  date!: Date;
  shipmentProviderCode!: ShippingProvider;
  packageSizeCode!: PackingSize;

  getAppliedRules(): AppliedRules {
    return this._appliedRules;
  }
  addAppliedRules(ruleName: string, source: Shipment, target: Shipment) {
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

    shippingRules.forEach((shippingRule, key) => {
      const source = this.partialCopy(this);
      const shipmentWithRulesApplied = shippingRule.applyRule(this);
      const target = this.partialCopy(shipmentWithRulesApplied);
      this.addAppliedRules(key, source, target);
      Object.assign(this, shipmentWithRulesApplied);
    });
  }

  private partialCopy(shipment: Shipment): Shipment {
    const copy = new Shipment();
    copy.date = this.date;
    copy.shipmentProviderCode = this.shipmentProviderCode;
    copy.packageSizeCode = this.packageSizeCode;
    copy.shippingCost = this.shippingCost;
    copy.shippingDiscount = this.shippingDiscount;
    return copy;
  }
  public validate(): boolean {
    if (
      this.date === undefined ||
      this.shipmentProviderCode === undefined ||
      this.packageSizeCode === undefined
    ) {
      this.ignore = true;
      return false;
    }
    return true;
  }

  public fromString(str: string, delimiter = " "): Shipment {
    const [date, packageSizeCode, shipmentProviderCode] = str.split(delimiter);

    this.date = new Date(date);
    this.shipmentProviderCode = shipmentProviderCode as ShippingProvider;
    this.packageSizeCode = packageSizeCode as PackingSize;
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

    return `${dateValue}${delimiter}${shipmentProviderCodeValue}${delimiter}${packageSizeCodeValue}${delimiter}${shippingCostValue}${delimiter}${shippingDiscount} \n`;
  }
}
