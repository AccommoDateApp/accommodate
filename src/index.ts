import { Container, Service as Injectable } from "typedi";
import { Service } from "./services";
import { PersistenceService } from "./services/persistence";
import { WebService } from "./services/web";

@Injectable()
class Application implements Service {
  private readonly services: Service[];

  constructor(persistence: PersistenceService, web: WebService) {
    this.services = [
      persistence,
      web,
    ];
  }

  public async bootstrap() : Promise<void> {
    for (const service of this.services) {
      await service.bootstrap();
    }
  }

  public async shutdown() : Promise<void> {
    for (const service of this.services) {
      await service.shutdown();
    }
  }
}

(async () => {
  const server = Container.get<Service>(Application);
  await server.bootstrap();
})();
