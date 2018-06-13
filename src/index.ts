import { Container, Service } from "typedi";
import { Provider } from "./providers";
import { JWTProvider } from "./providers/jwt";
import { PersistenceProvider } from "./providers/persistence";
import { WebProvider } from "./providers/web";

@Service()
class Application implements Provider {
  private readonly services: Provider[];

  constructor(
    persistence: PersistenceProvider,
    jwt: JWTProvider,
    web: WebProvider,
  ) {
    this.services = [
      persistence,
      jwt,
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
  const server = Container.get<Provider>(Application);
  await server.bootstrap();
})();
