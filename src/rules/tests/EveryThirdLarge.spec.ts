import { expect } from "chai";
import { ShipmentsRepository } from "../../repository/Shipments";
import { Shipment } from "../../shared/Shipment";
import { EveryThirdLarge } from "../EveryThirdLarge";

describe("Every Third Large package is free, rule: EveryThirdLarge", () => {
  beforeEach(() => {
    ShipmentsRepository.clearAll();
  });
  it("should pass with 3 packages per month", () => {
    const rule = new EveryThirdLarge();

    const data = Array.from<string>({ length: 3 }).fill("2015-02-03 L LP");
    data.push(...Array.from<string>({ length: 3 }).fill("2015-03-03 L LP"));

    data.forEach((row, index) => {
      const shipment = new Shipment();

      shipment.fromString(row);
      shipment.applyShippingRates();

      const shipmentWithRuleApplied = rule.applyRule(shipment);
      if ((index + 1) % 3 === 0) {
        expect(shipmentWithRuleApplied.shippingCost).to.equal(0);
      } else {
        expect(shipmentWithRuleApplied.shippingCost).to.equal(
          shipment.shippingCost
        );
      }
    });
  });
  it("should 4th shipment per month should not be free", () => {
    const rule = new EveryThirdLarge();

    const data = Array.from<string>({ length: 4 }).fill("2015-02-03 L LP");

    data.forEach((row, index) => {
      const shipment = new Shipment();

      shipment.fromString(row);
      shipment.applyShippingRates();

      const shipmentWithRuleApplied = rule.applyRule(shipment);
      if (index === 3) {
        expect(shipmentWithRuleApplied.shippingCost).to.equal(
          shipment.shippingCost
        );
      }
    });
  });
});
