import { createReadStream } from "fs";
import { Shipment } from "./shared/Shipment";
import "./rules";
import { EventEmitter } from "stream";

export class Main extends EventEmitter {
  private filename: string;
  private lineEndings: string | RegExp;
  private delimiter: string;
  constructor(
    {
      filename,
      lineEndings,
      delimiter,
    }: { filename: string; lineEndings: string | RegExp; delimiter: string } = {
      filename: "input.txt",
      lineEndings: /\r?\n/,
      delimiter: " ",
    }
  ) {
    super();
    this.filename = filename;
    this.lineEndings = lineEndings;
    this.delimiter = delimiter;

    this.on("shipmentData", (data) => {
      this.output(data.toString());
    });
  }

  public output(data: string) {
    process.stdout.write(data.toString());
  }

  public async processInput() {
    return new Promise((resolve, reject) => {
      const inputStream = createReadStream(this.filename);

      inputStream.on("data", (chunk) => {
        const lines = chunk.toString().split(this.lineEndings);
        lines.forEach((line) => {
          const shipment = new Shipment().fromString(line, this.delimiter);
          if (shipment.validate()) {
            shipment.applyShippingRates();
            shipment.applyShippingRules();
          }
          this.emit("shipmentData", shipment.toString());
        });
      });

      inputStream.on("end", () => {
        resolve(true);
      });
    });
  }
}
