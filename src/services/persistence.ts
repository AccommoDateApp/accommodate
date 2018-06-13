import "reflect-metadata";
import { Connection, createConnection, EntitySchema, Repository } from "typeorm";
import { Service } from ".";

type Entity<T> = new () => T;

export class PersistenceService implements Service {
  private connection?: Connection;

  public async bootstrap() : Promise<void> {
    if (!this.connection) {
      try {
        this.connection = await createConnection();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  }

  public async shutdown() : Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }

  public getRepository<T>(entity: Entity<T>) : Repository<T> {
    if (this.connection) {
      return this.connection.manager.getRepository<T>(entity);
    }

    throw new Error("persistence not connected to server");
  }
}
