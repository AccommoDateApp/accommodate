import { PersistenceProvider } from "../../src/providers/persistence";

export class MockPersistenceProvider extends PersistenceProvider {
  private get entityNames() {
    if (this.connection) {
      return this.connection.entityMetadatas.map((m) => m.name);
    }

    return [];
  }

  public async clear() {
    for (const name of this.entityNames) {
      const repo = this.connection.getRepository(name);
      const entities = await repo.find({});

      for (const entity of entities) {
        await repo.remove(entity);
      }
    }
  }

  public async shutdown() : Promise<void> {
    await this.clear();
    await super.shutdown();
  }
}
