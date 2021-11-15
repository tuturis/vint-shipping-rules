import { VintShippingRules } from "./VintShippingRules";

const vintShippingRules = new VintShippingRules({
  pathToFile: process.argv[2] || "input.txt",
  delimiter: process.argv[3] || " ",
});

(async () => {
  await vintShippingRules.processInput();
})();
