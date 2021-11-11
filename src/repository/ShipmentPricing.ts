import { PackingSize, ShippingProvider } from "..";
import { Shipment } from "../shared";

export type PricingData = {
  [provider in ShippingProvider]: {
    [size in PackingSize]: number;
  };
};

export interface ShipmentPricingData {
  shippingProviderCode: ShippingProvider;
  packingSizeCode: PackingSize;
  price: number;
}

export class ShipmentPricing {
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
    console.log("---------");
    console.log(
      shipment.shipmentProviderCode,
      "    -----     ",
      shipment.packageSizeCode
    );
    return this.pricingData[shipment.shipmentProviderCode][
      shipment.packageSizeCode
    ];
  }

  getLowestPrice(size: PackingSize): ShipmentPricingData {
    const lowestPriceData = Object.entries(this.pricingData);
    // @ts-ignore something weird with ts lint
    const lp = lowestPriceData.reduce(
      //@ts-ignore
      (acc, pd) => {
        const price = pd[1][size];
        if (price < acc.price) {
          const provider = pd[0];
          acc.price = price;
          // @ts-ignore
          acc.provider = provider;
        }
      },
      { price: 0, provider: "-" }
    ) as { price: number; provider: ShippingProvider };

    return {
      //@ts-ignore
      shippingProvider: lp.provider as ShippingProvider,
      packingSize: size,
      price: lp.price,
    };
  }
}
