import { Request } from "express";
import { BodyParam, JsonController, Post, Put, Req } from "routing-controllers";
import * as sha from "sha.js";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
import { Biography, UserMode } from "../entity/Biography";
import { LandlordBiography } from "../entity/LandlordBiography";
import { TenantBio } from "../entity/TenantBio";
import { User } from "../entity/User";
import { JWTProvider } from "../providers/jwt";

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
  public async signup(
    @BodyParam("email") email: string,
    @BodyParam("password") password: string,
    @BodyParam("mode") mode: UserMode,
  ) {
    if (!email || !password) {
      throw new Error("either no password or no email specified");
    }

    const existingUsers = await this.repo.find({
      email,
    });

    if (existingUsers.length > 0) {
      throw new Error("user with this email already exists");
    }

    let bio: Biography;

    switch (mode) {
      case UserMode.Landlord:
        bio = new LandlordBiography();
        break;

      case UserMode.Tenant:
        bio = new TenantBio();
        break;

      default:
        throw new Error("invalid mode");
    }

    const user = this.repo.create();

    user.email = email;
    user.password = this.hashPassword(password);
    user.bio = bio;

    await this.repo.save(user);

    return true;
  }

  @Post("/login")
  public async login(@BodyParam("email") email: string, @BodyParam("password") password: string) {
    const users = await this.repo.find({
      email,
    });

    if (users.length === 0) {
      throw new Error("no user found with these credentials");
    }

    const user = users[0];

    if (user.password === this.hashPassword(password)) {
      return this.jwt.sign({
        id: user.id,
      });
    } else {
      throw new Error("invalid credentials");
    }
  }

  @Put("/password")
  public async updatePassword(@Req() request: Request, @BodyParam("password") password: string) {
    const user = await this.getUserFromRequest(request);

    user.password = this.hashPassword(password);
    await this.repo.save(user);

    return true;
  }

  private hashPassword(password: string) : string {
    return new sha.sha256().update(password).digest("hex");
  }
}
