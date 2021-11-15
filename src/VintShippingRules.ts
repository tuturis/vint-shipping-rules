import { createReadStream } from "fs";
import { Interface as ReadlineInterface } from "readline";

import { Shipment } from "./shared/Shipment";

type VintShippingRulesOptions = {
  pathToFile: string;
  delimiter?: string;
};
export class VintShippingRules extends ReadlineInterface {
  private delimiter: string;
  constructor(
    options: VintShippingRulesOptions = {
      pathToFile: "input.txt",
      delimiter: " ",
    }
  ) {
    const inputStream = createReadStream(options.pathToFile);
    super({
      input: inputStream,
    });
    this.delimiter = options.delimiter ? options.delimiter : " ";

    this.pause();
  }

  public output(data: string) {
    process.stdout.write(data);
  }

  public async processInput() {
    return new Promise((resolve, reject) => {
      this.resume();
      this.on("line", (line) => {
        const shipment = new Shipment().fromString(line, this.delimiter);
        if (shipment.validate()) {
          shipment.applyShippingRates();
          shipment.applyShippingRules();
        }
        this.output(shipment.toString());
      });
      this.on("close", () => {
        resolve(true);
      });
    });
  }
}
