import { Request } from "express";
import { ObjectId } from "mongodb";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class BaseController {
  constructor(protected readonly users: Repository<User>) { }

  protected async getUserFromRequest(request: Request) : Promise<User> {
    const { id } = request.user;
    const users = await this.users.findByIds([
      new ObjectId(id),
    ]);

    if (users.length === 0) {
      throw new Error("invalid token");
    }

    return users[0];
  }

  protected async trimUserDetails(user: User) : Promise<User> {
    const copy = {
      ...user,
    };

    delete copy.id;
    delete copy.password;

    return copy;
  }
}
