import * as cors from "cors";
import * as express from "express";
import { Server } from "http";
import { join } from "path";
import { useContainer, useExpressServer } from "routing-controllers";
import { Service } from "typedi";
import { Container } from "typedi";
import { Provider } from ".";
import { JWTProvider } from "./jwt";

@Service()
export class WebProvider implements Provider {
  private app?: Server;

  private get isDevelopment() : boolean {
    return process.env.NODE_ENV !== "production";
  }

  private get port() : number {
    return Number(process.env.PORT) || 3000;
  }

  constructor(private readonly jwt: JWTProvider) { }

  public async bootstrap() : Promise<void> {
    if (!this.app) {
      useContainer(Container);

      const server = express();

      server.use(cors());
      server.use(this.jwt.getExpressMiddleware());

      const routedServer = useExpressServer(server, {
        controllers: [
          join(__dirname, "../controllers/*"),
        ],
        cors: true,
        development: this.isDevelopment,
        routePrefix: "/api",
      });

      return new Promise<void>((resolve, reject) => {
        this.app = routedServer.listen(this.port, (error: Error) => {
          if (error) {
            reject(error);
          }

          resolve();
        });
      });
    }
  }

  public async shutdown() : Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.app) {
        this.app.close(() => resolve());
      }
    });
  }
}
