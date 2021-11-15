import { createReadStream, ReadStream } from "fs";

import { Shipment } from "./shared/Shipment";
import { LineStream } from "./utils/LineStream";

type VintShippingRulesOptions = {
  pathToFile: string;
  delimiter: string;
};

const lineStream = new LineStream();

export class VintShippingRules {
  delimiter: string;
  pathToFile: string;
  readStream?: ReadStream;
  lineStream?: LineStream;

  constructor(
    options: VintShippingRulesOptions = {
      pathToFile: "input.txt",
      delimiter: " ",
    }
  ) {
    this.pathToFile = options.pathToFile;
    this.delimiter = options.delimiter;
  }

  public output(string: string) {
    process.stdout.write(string);
  }

  public async processInput() {
    return new Promise((resolve, reject) => {
      const shipment = new Shipment();

      shipment.on("data", (shipment: Shipment) => {
        this.output(shipment.toString());
      });

      shipment.on("end", () => {
        resolve(true);
      });
      createReadStream(this.pathToFile).pipe(lineStream).pipe(shipment);
    });
  }
}
