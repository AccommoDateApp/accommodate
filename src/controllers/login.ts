import { Request } from "express";
import { Get, JsonController, Req } from "routing-controllers";
import { JWTProvider } from "../providers/jwt";

@JsonController("/auth")
export class AuthController {
  constructor(private readonly jwt: JWTProvider) { }

  @Get("/login")
  public login() {
    return {
      token: this.jwt.sign({ userId: "" }),
    };
  }

  @Get("/check")
  public check(@Req() request: Request) {
    return request.user;
  }
}
