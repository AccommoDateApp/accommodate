import { Request } from "express";
import { ObjectID } from "mongodb";
import { BodyParam, Delete, Get, JsonController, Param, Post, Req } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BaseController } from ".";
import { PowerUp } from "../entity/PowerUp";
import { User } from "../entity/User";

@JsonController("/powerups")
export class PowerUpsController extends BaseController {
  constructor(
    @InjectRepository(User)
    users: Repository<User>,
    @InjectRepository(PowerUp)
    private readonly powerups: Repository<PowerUp>,
  ) {
    super(users);
  }

  @Get("/store")
  public async getAvailablePowerUps(@Req() request: Request) {
    const user = await this.getUserFromRequest(request);

    return this.powerups.find({
      availableFor: user.mode,
    });
  }

  @Post("/store")
  public async buyPowerUp(@Req() request: Request, @BodyParam("id") powerupId: string, @BodyParam("quantity") quantity: number = 1) {
    const user = await this.getUserFromRequest(request);
    const powerups = await this.powerups.findByIds([
      new ObjectID(powerupId),
    ]);

    if (!powerups.length) {
      throw new Error("no such powerup");
    }

    for (let i = 0; i < quantity; i++) {
      user.powerups.push(powerups[0]);
    }

    await this.users.save(user);

    return user.powerups;
  }

  @Delete("/:id")
  public async removePowerUp(@Req() request: Request, @Param("id") powerupId: string) {
    const user = await this.getUserFromRequest(request);
    const id = new ObjectID(powerupId);

    for (let i = 0; i < user.powerups.length; i++) {
      const powerup = user.powerups[i];

      if (powerup.id.equals(id as any)) {
        user.powerups.splice(i, 1);
        await this.users.save(user);

        break;
      }
    }

    return user.powerups;
  }
}
