import * as jwt from "express-jwt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";
import { BasicProvider } from ".";

@Service()
export class JWTProvider extends BasicProvider {
  private get secret() : string {
    return process.env.JWT_SECRET || "insecure_default_secret";
  }

  public getExpressMiddleware() : jwt.RequestHandler {
    return jwt({
      credentialsRequired: false,
      secret: this.secret,
    });
  }

  public sign(value: any) : string {
    return sign(value, this.secret);
  }
}
