import { PackingSize, ShippingProvider } from "../enums";
import { ShipmentPricing } from "../repository/ShipmentPricing";
import { MetadataStorage } from "./MetadataStorage";

export class Shipment {
  shippingCost?: number = 0;
  shippingDiscount?: number = 0;
  date!: Date;
  shipmentProviderCode!: ShippingProvider;
  packageSizeCode!: PackingSize;

  public fromString(str: string | Buffer, delimiter = " "): Shipment {
    str = str.toString("utf-8");
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
    let shippingRules = MetadataStorage.getInstance().getMetadata(
      "shippingRules"
    ) as any;
    console.log(shippingRules);
    // @TODO change to an singleton
    Object.assign(this, new shippingRules().applyRule(this));
  }
}
