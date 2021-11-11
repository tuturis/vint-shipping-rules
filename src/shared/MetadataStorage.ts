export class MetadataStorage {
  static instance: MetadataStorage;
  static getInstance() {
    if (!MetadataStorage.instance) {
      MetadataStorage.instance = new MetadataStorage();
    }
    return MetadataStorage.instance;
  }

  private metadata: Map<Function, any> = new Map();

  public addMetadata(target: any, metadata: any) {
    this.metadata.set(target, metadata);
  }
  public getMetadata(target: any): any {
    return this.metadata.get(target);
  }
  private constructor() {}
}
