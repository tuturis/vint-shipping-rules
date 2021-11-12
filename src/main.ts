import { createReadStream } from "fs";
import { Shipment } from "./shared/Shipment";
import "./rules";

export class Main {
  private filename: string;
  constructor(filename = "input.txt") {
    this.filename = filename;
    this.processInput();
  }

  //create read stream to read input.txt file line by line and process each line
  public processInput() {
    const inputStream = createReadStream(this.filename);
    inputStream.on("data", (chunk) => {
      const lines = chunk.toString().split(/\r?\n/);
      lines.forEach((line) => {
        const shipment = new Shipment().fromString(line);
        if (shipment.validate()) {
          shipment.applyShippingRates();
          shipment.applyShippingRules();
        }
        process.stdout.write(shipment.toString());
      });
    });
  }
}
