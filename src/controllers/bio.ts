import { Request } from "express";
import { ObjectId } from "mongodb";
import { Body, Get, JsonController, Param, Put, Req } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
import { Bio } from "../entity/Bio";
import { User } from "../entity/User";

@JsonController("/bio")
export class BioController extends BaseController {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super(repo);
  }

  @Get("/")
  public async getBio(@Req() request: Request) {
    const user = await this.getUserFromRequest(request);

    return user.bio;
  }

  @Put("/")
  public async updateBio(@Req() request: Request, @Body() updatedBio: Bio) {
    const user = await this.getUserFromRequest(request);

    Object.keys(updatedBio)
          .filter((key) => key in user.bio)
          .forEach((key) => user.bio[key] = updatedBio[key]);

    await this.repo.save(user);

    return user.bio;
  }

  @Get("/:id")
  public async getBioById(@Param("id") id: string) {
    const users = await this.repo.findByIds([
      new ObjectId(id),
    ]);

    if (users.length === 0) {
      throw new Error("no user with this id");
    }

    return users[0].bio;
  }
}
