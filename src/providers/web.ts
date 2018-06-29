import * as cors from "cors";
import * as express from "express";
import * as mung from "express-mung";
import { Server } from "http";
import { join } from "path";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { Service } from "typedi";
import { Provider } from ".";
import { objectIdToHex } from "../entity";
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

      const walkItem = (item: any) => {
        if (typeof item === "string" || typeof item === "number") {
          return item;
        }

        if (typeof item === "object") {
          return walkObject(item);
        }

        return item;
      };

      const walkObject = (object: any) => {
        const result: any = {};

        for (const key of Object.keys(object)) {
          const value = object[key];

          if (Array.isArray(value)) {
            result[key] = value.map(walkItem);
            continue;
          }

          if (key === "id" && typeof value === "object") {
            result[key] = objectIdToHex(value);
          } else {
            result[key] = walkItem(value);
          }
        }

        return result;
      };

      const idToStringMiddleware = mung.json((body, req, res) => {
        if (Array.isArray(body)) {
          return body.map(walkItem);
        }

        if (typeof body === "string" || typeof body === "number") {
          return res.json(body);
        }

        return walkObject(body);
      });

      server.use(idToStringMiddleware);

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
