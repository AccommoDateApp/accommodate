import { RequestHandler } from "express";
import * as jwt from "express-jwt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";
import { BasicProvider } from ".";

@Service()
export class JWTProvider extends BasicProvider {
  private get secret() : string {
    return process.env.JWT_SECRET || "insecure_default_secret";
  }

  public getExpressMiddleware() : RequestHandler {
    return jwt({
      credentialsRequired: true,
      secret: this.secret,
    }).unless({
      path: [
        "/api/users/signup",
        "/api/users/login",
      ],
    });
  }

  public sign(value: any) : string {
    return sign(value, this.secret);
  }
}
