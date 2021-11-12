import { PackingSize, ShippingProvider } from "../enums";
import { ShipmentPricing } from "../repository/ShipmentPricing";
import { ShippingRulesStorage } from "./ShippingRulesStorage";

export class Shipment {
  shippingCost: number = Infinity;
  shippingDiscount: number = 0;
  date!: Date;
  shipmentProviderCode!: ShippingProvider;
  packageSizeCode!: PackingSize;

  public fromString(str: string, delimiter = " "): Shipment {
    const [date, packageSizeCode, shipmentProviderCode] = str.split(delimiter);
    this.date = new Date(date);
    this.shipmentProviderCode = shipmentProviderCode as ShippingProvider;
    this.packageSizeCode = packageSizeCode as PackingSize;
    return this;
  }

  public toString(delimiter = " "): string {
    return `${this.date}${delimiter}${this.shipmentProviderCode}${delimiter}${this.packageSizeCode}${delimiter}${this.shippingCost}${delimiter}${this.shippingDiscount} \n`;
  }

  public applyShippingRates() {
    this.shippingCost = new ShipmentPricing().getPrice(this);
  }

  public applyShippingRules() {
    let shippingRules = ShippingRulesStorage.getRules() as Map<any, any>;
    shippingRules.forEach((shippingRule, key) => {
      const shipmentWithRulesApplied = shippingRule.applyRule(this);
      Object.assign(this, shipmentWithRulesApplied);
      // or either block below - theres pros and cons to both:)
      // this.shippingCost = shipmentWithRulesApplied.shippingCost;
      // this.shippingDiscount = shipmentWithRulesApplied.shippingDiscount;
      // this.shipmentProviderCode = shipmentWithRulesApplied.shipmentProviderCode;
      // this.packageSizeCode = shipmentWithRulesApplied.packageSizeCode;
    });
  }
}
