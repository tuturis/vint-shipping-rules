import { MetadataStorage } from "../shared/MetadataStorage";

export function ShippingRule<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  MetadataStorage.getInstance().addMetadata("shippingRules", constructor);
}
