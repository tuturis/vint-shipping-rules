import { Shipment } from "../shared";

interface IShipments {
  [year: string]: { [month: string]: number };
}
class Shipments {
  shipments: IShipments = {};

  monthlyShipmentCount(date: Date): number {
    const shipmentYear = date.getFullYear();
    const shipmentMonth = date.getMonth();

    if (
      this.shipments[shipmentYear] &&
      this.shipments[shipmentYear][shipmentMonth]
    ) {
      return this.shipments[shipmentYear][shipmentMonth];
    }
    return 0;
  }

  incrementMonthlyShipments(shipment: Shipment): number {
    const shipmentDate = shipment.date;
    const shipmentYear = shipmentDate.getFullYear();
    const shipmentMonth = shipmentDate.getMonth();
    if (!this.shipments[shipmentYear]) {
      this.shipments[shipmentYear] = {};
    }
    if (!this.shipments[shipmentYear][shipmentMonth]) {
      this.shipments[shipmentYear][shipmentMonth] = 1;
      return this.shipments[shipmentYear][shipmentMonth];
    }
    this.shipments[shipmentYear][shipmentMonth] += 1;
    return this.shipments[shipmentYear][shipmentMonth];
  }
}

export const ShipmentsRepository = new Shipments();
