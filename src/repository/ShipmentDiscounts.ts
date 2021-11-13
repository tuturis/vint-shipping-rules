import { Shipment } from "../shared";

interface IShipmentDiscounts {
  [year: string]: {
    [month: string]: number;
  };
}
class ShipmentsDiscount {
  shipmentDiscounts: IShipmentDiscounts = {};
  getMonthlyDiscountAmount(shipment: Shipment): number {
    const { date } = shipment;
    const year = date.getFullYear();
    const month = date.getMonth();

    if (this.shipmentDiscounts[year] && this.shipmentDiscounts[year][month]) {
      return this.shipmentDiscounts[year][month];
    }
    return 0;
  }
  incrementMonthlyDiscountAmount(shipment: Shipment) {
    const { date, shippingDiscount } = shipment;
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!this.shipmentDiscounts[year]) {
      this.shipmentDiscounts[year] = {};
    }
    if (!this.shipmentDiscounts[year][month]) {
      this.shipmentDiscounts[year][month] = 0;
    }
    this.shipmentDiscounts[year][month] += shippingDiscount;
  }

  clearAll() {
    this.shipmentDiscounts = {};
    return this;
  }
}

export const ShipmentsDiscountRepository = new ShipmentsDiscount();
