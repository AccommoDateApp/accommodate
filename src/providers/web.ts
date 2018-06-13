import { Application } from "express";
import { Server } from "http";
import { join } from "path";
import { createExpressServer, useContainer } from "routing-controllers";
import { Service } from "typedi";
import { Container } from "typedi";
import { Provider } from ".";

@Service()
export class WebProvider implements Provider {
  private app?: Server;

  public async bootstrap() : Promise<void> {
    if (!this.app) {
      useContainer(Container);

      const port = process.env.PORT || 3000;
      const server: Application = createExpressServer({
        controllers: [
          join(__dirname, "../controllers/*"),
        ],
      });

      return new Promise<void>((resolve, reject) => {
        this.app = server.listen(port, (error: Error) => {
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
