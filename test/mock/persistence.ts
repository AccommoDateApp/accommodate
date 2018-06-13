import { join } from "path";
import { createConnection } from "typeorm";
import { PersistenceProvider } from "../../src/providers/persistence";

export class MockPersistenceProvider extends PersistenceProvider {
  public async bootstrap() : Promise<void> {
    if (!this.connection) {
      this.connection = await createConnection({
        dropSchema: true,
        entities: [
          join(__dirname, "../../src/entity/*"),
        ],
        logging: false,
        synchronize: true,
        type: "sqljs",
      });
    }
  }
}
