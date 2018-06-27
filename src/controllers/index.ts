import { Request } from "express";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class BaseController {
  constructor(protected readonly users: Repository<User>) { }

  protected async getUserFromRequest(request: Request) : Promise<User> {
    const { id } = request.user;
    return await this.users.findOneOrFail(id);
  }
}
