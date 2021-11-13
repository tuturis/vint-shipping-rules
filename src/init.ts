import { VintShippingRules } from "./VintShippingRules";

const vintShippingRules = new VintShippingRules({
  pathToFile: process.argv[2] || "input.txt",
});

(async () => {
  await vintShippingRules.processInput();
})();
