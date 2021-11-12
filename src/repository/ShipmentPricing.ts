import { PackingSize, ShippingProvider } from "..";
import { Shipment } from "../shared";

type PricingDataShipmentProvider = Exclude<
  ShippingProvider,
  ShippingProvider.None
>;
type PackingSizePrice = { [size in PackingSize]: number };
export type PricingData = {
  [provider in PricingDataShipmentProvider as PricingDataShipmentProvider]: PackingSizePrice;
};

export interface ShipmentPricingData {
  shippingProviderCode: ShippingProvider;
  packingSizeCode: PackingSize;
  price: number;
}

class ShipmentPricing {
  pricingData: PricingData = {
    MR: {
      [PackingSize.Small]: 200,
      [PackingSize.Medium]: 300,
      [PackingSize.Large]: 400,
    },
    LP: {
      [PackingSize.Small]: 150,
      [PackingSize.Medium]: 490,
      [PackingSize.Large]: 690,
    },
  };

  getPrice(shipment: Shipment): number {
    if (shipment.shipmentProviderCode === ShippingProvider.None) {
      return Infinity;
    }
    return this.pricingData[shipment.shipmentProviderCode][
      shipment.packageSizeCode
    ];
  }

  getLowestPrice(size: PackingSize): ShipmentPricingData {
    const lowestPriceData = Object.entries(this.pricingData) as [
      PricingDataShipmentProvider,
      PackingSizePrice
    ][];

    const lp = lowestPriceData.reduce(
      (acc, pd) => {
        const price = pd[1][size];
        if (price < acc.price) {
          const provider = pd[0];
          acc.price = price;
          acc.provider = provider;
        }
        return acc;
      },
      { price: Infinity, provider: ShippingProvider.None }
    );

    return {
      shippingProviderCode: lp.provider,
      packingSizeCode: size,
      price: lp.price,
    };
  }
}
export const ShipmentPricingRepository = new ShipmentPricing();
