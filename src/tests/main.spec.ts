import { expect } from "chai";
import mockfs from "mock-fs";

import { Main } from "../main";
import { ShipmentsDiscountRepository } from "../repository/ShipmentDiscounts";
import { ShipmentsRepository } from "../repository/Shipments";
import { testData } from "./testData";

mockfs({
  "input.txt": testData.input,
});

describe("Integration test", function () {
  beforeEach(() => {
    ShipmentsRepository.clearAll();
    ShipmentsDiscountRepository.clearAll();
  });
  describe("Main", async () => {
    it("should apply rules to inputs", async () => {
      const payloads: string[] = [];
      const main = new Main();
      main.output = (payload: string) => payloads.push(payload);
      await main.processInput();

      expect(payloads.join("")).to.be.equal(testData.output);
    });
  });
});
