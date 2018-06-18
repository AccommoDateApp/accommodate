import { Request } from "express";
import { Body, BodyParam, JsonController, Post, Put, Req } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
import { User } from "../entity/User";
import { JWTProvider } from "../providers/jwt";

// hack, because we don't have typedefs for sha.js
// tslint:disable-next-line:no-var-requires
const sha = require("sha.js");

@JsonController("/users")
export class UserController extends BaseController {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly jwt: JWTProvider,
  ) {
    super(repo);
  }

  @Post("/signup")
  public async signup(@BodyParam("email") email: string, @BodyParam("password") password: string) {
    if (!email || !password) {
      throw new Error("either no body or no email specified");
    }

    const existingUsers = await this.repo.find({
      email,
    });

    if (existingUsers.length > 0) {
      throw new Error("user with this email already exists");
    }

    const user = new User();
    user.email = email;
    user.password = this.hashPassword(password);

    this.repo.save(user);
    this.repo.insert(user);

    return await this.login(email, password);
  }

  @Post("/login")
  public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
    const users = await this.repo.find({
      email,
    });

    if (users.length === 0) {
      throw new Error("no user found with this credentials");
    }

    const user = users[0];

    if (user.password === this.hashPassword(password)) {
      return this.jwt.sign({
        id: user.id.toHexString(),
      });
    } else {
      throw new Error("invalid credentials");
    }
  }

  @Put("/profile")
  public async updateProfile(@Req() request: Request, @Body() updatedUser: User) {
    const user = await this.getUserFromRequest(request);

    delete updatedUser.email;
    delete updatedUser.password;
    delete updatedUser.mode;

    const mergedUser = await this.repo.merge(user, updatedUser);
    await this.repo.save(mergedUser);

    return await this.trimUserDetails(mergedUser);
  }

  private hashPassword(password: string) : string {
    return new sha.sha256().update(password).digest("hex");
  }
}
