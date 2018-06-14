export interface Provider {
  bootstrap() : Promise<void>;
  shutdown() : Promise<void>;
}

export abstract class BasicProvider implements Provider {
  public async bootstrap() : Promise<void> {
    return;
  }

  public async shutdown() : Promise<void> {
    return;
  }
}
