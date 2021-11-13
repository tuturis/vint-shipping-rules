import { Shipment } from "../shared";

interface IShipments {
  [year: string]: {
    [month: string]: {
      [shipmentProvider: string]: {
        [packingSize: string]: number;
      };
    };
  };
}
class Shipments {
  shipments: IShipments = {};

  monthlyShipmentCount(shipment: Shipment): number {
    const date = shipment.date;
    const shipmentYear = date.getFullYear();
    const shipmentMonth = date.getMonth();
    const shipmentProvider = shipment.shipmentProviderCode;
    const packingSize = shipment.packageSizeCode;
    if (
      this.shipments[shipmentYear] &&
      this.shipments[shipmentYear][shipmentMonth] &&
      this.shipments[shipmentYear][shipmentMonth][shipmentProvider] &&
      this.shipments[shipmentYear][shipmentMonth][shipmentProvider][packingSize]
    ) {
      return this.shipments[shipmentYear][shipmentMonth][shipmentProvider][
        packingSize
      ];
    }
    return 0;
  }

  incrementMonthlyShipments(shipment: Shipment): number {
    const { date, shipmentProviderCode, packageSizeCode } = shipment;
    const shipmentYear = date.getFullYear();
    const shipmentMonth = date.getMonth();

    if (!this.shipments[shipmentYear]) {
      this.shipments[shipmentYear] = {};
    }

    if (!this.shipments[shipmentYear][shipmentMonth]) {
      this.shipments[shipmentYear][shipmentMonth] = {};
    }

    if (!this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode]) {
      this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode] = {};
    }

    if (
      !this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode][
        packageSizeCode
      ]
    ) {
      this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode][
        packageSizeCode
      ] = 1;
      return this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode][
        packageSizeCode
      ];
    }

    this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode][
      packageSizeCode
    ] += 1;
    return this.shipments[shipmentYear][shipmentMonth][shipmentProviderCode][
      packageSizeCode
    ];
  }
  clearAll() {
    this.shipments = {};
  }
}

export const ShipmentsRepository = new Shipments();
