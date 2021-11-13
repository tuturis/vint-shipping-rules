import { expect } from "chai";

import { ShipmentsDiscountRepository } from "../../repository/ShipmentDiscounts";
import { ShipmentsRepository } from "../../repository/Shipments";
import { Shipment } from "../../shared/Shipment";
import { DiscountAccumulation } from "../DiscountAccumulation";
import { EveryThirdLarge } from "../EveryThirdLarge";
import { SmallPackageLowestCostRule } from "../SmallPackageLowestCostRule";

describe("Discount Accumulation", () => {
  const smallPackageLowestCostRule = new SmallPackageLowestCostRule();
  const discountAccumulationRule = new DiscountAccumulation();
  const everyThirdLargeRule = new EveryThirdLarge();

  beforeEach(() => {
    ShipmentsRepository.clearAll();
    ShipmentsDiscountRepository.clearAll();
  });

  it(`should stop giving discounts for "SmallPackageLowestCost" after
   exceeding total discount of 10 currency per month`, () => {
    const shipmentData = Array.from<string>({ length: 21 }).fill(
      "2015-02-01 S MR"
    );
    shipmentData.push(
      ...Array.from<string>({ length: 21 }).fill("2015-03-05 S MR")
    );

    shipmentData.forEach((string, index) => {
      const shipment = new Shipment();

      shipment.fromString(string);

      const totalDiscount =
        ShipmentsDiscountRepository.getMonthlyDiscountAmount(shipment);

      shipment.applyShippingRates();

      const shipmenSmallPackageRuleApplied =
        smallPackageLowestCostRule.applyRule(shipment);
      const shipmentDiscountAccumulationRuleApplied =
        discountAccumulationRule.applyRule(shipmenSmallPackageRuleApplied);

      if (totalDiscount >= discountAccumulationRule.monthlyDiscountLimit) {
        expect(
          shipmentDiscountAccumulationRuleApplied.shippingDiscount
        ).to.be.equal(0);
      }
    });
  });
  it("should apply partial discount for third Large LP package", () => {
    const shipmentData = Array.from<string>({ length: 15 }).fill(
      "2015-02-01 S MR"
    );
    shipmentData.push(
      ...Array.from<string>({ length: 3 }).fill("2015-02-01 L LP")
    );

    shipmentData.forEach((string, index) => {
      const shipment = new Shipment();

      shipment.fromString(string);

      const totalDiscount =
        ShipmentsDiscountRepository.getMonthlyDiscountAmount(shipment);

      shipment.applyShippingRates();

      const shipmenSmallPackageRuleApplied =
        smallPackageLowestCostRule.applyRule(shipment);
      const everyThirdLargeRuleApplied = everyThirdLargeRule.applyRule(
        shipmenSmallPackageRuleApplied
      );
      const shipmentDiscountAccumulationRuleApplied =
        discountAccumulationRule.applyRule(everyThirdLargeRuleApplied);

      if (
        totalDiscount +
          shipmentDiscountAccumulationRuleApplied.shippingDiscount >=
        discountAccumulationRule.monthlyDiscountLimit
      ) {
        expect(
          shipmentDiscountAccumulationRuleApplied.shippingDiscount
        ).to.be.equal(250);
      }
    });
  });
  it("should test specific sequence from given test data", () => {
    const shipmentData = [
      "2015-02-01 S MR",
      "2015-02-02 S MR",
      "2015-02-03 L LP",
      "2015-02-05 S LP",
      "2015-02-06 S MR",
      "2015-02-06 L LP",
      "2015-02-07 L MR",
      "2015-02-08 M MR",
      "2015-02-09 L LP",
      "2015-02-10 L LP",
      "2015-02-10 S MR",
      "2015-02-10 S MR",
      "2015-02-11 L LP",
      "2015-02-12 M MR",
      "2015-02-13 M LP",
      "2015-02-15 S MR",
      "2015-02-17 L LP",
      "2015-02-17 S MR",
    ];
    shipmentData.forEach((string, index) => {
      const shipment = new Shipment();

      shipment.fromString(string);

      const totalDiscount =
        ShipmentsDiscountRepository.getMonthlyDiscountAmount(shipment);

      shipment.applyShippingRates();

      const shipmenSmallPackageRuleApplied =
        smallPackageLowestCostRule.applyRule(shipment);
      const everyThirdLargeRuleApplied = everyThirdLargeRule.applyRule(
        shipmenSmallPackageRuleApplied
      );
      const shipmentDiscountAccumulationRuleApplied =
        discountAccumulationRule.applyRule(everyThirdLargeRuleApplied);

      if (
        totalDiscount +
          shipmentDiscountAccumulationRuleApplied.shippingDiscount >=
        discountAccumulationRule.monthlyDiscountLimit
      ) {
        expect(
          shipmentDiscountAccumulationRuleApplied.shippingDiscount
        ).to.be.equal(10);
      }
    });
  });
});
