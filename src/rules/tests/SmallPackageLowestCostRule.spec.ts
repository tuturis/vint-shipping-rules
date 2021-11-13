import { expect } from "chai";
import { Shipment } from "../../shared";
import { SmallPackageLowestCostRule } from "../SmallPackageLowestCostRule";

describe("Small Package Lowest Cost Rule", () => {
  it("should find new shipping provider for small packaging shipments", () => {
    const rule = new SmallPackageLowestCostRule();
    const shipment = new Shipment();

    shipment.fromString("2015-02-01 S MR");
    shipment.applyShippingRates();

    const shipmentWithRuleApplied = rule.applyRule(shipment);

    expect(shipmentWithRuleApplied.shippingCost).to.equal(150);
    expect(shipmentWithRuleApplied.shippingDiscount).to.equal(50);
    expect(shipmentWithRuleApplied.shipmentProviderCode).to.equal("LP");
    expect(shipmentWithRuleApplied.packageSizeCode).to.equal("S");
  });
});
