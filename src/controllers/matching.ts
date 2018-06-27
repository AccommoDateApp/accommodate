import { Request } from "express";
import { ObjectId } from "mongodb";
import { BodyParam, Get, JsonController, Post, Req } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserMode } from "../entity/Biography";
import { Match } from "../entity/Match";
import { RealEstate } from "../entity/RealEstate";
import { User } from "../entity/User";
import { BaseController } from "./index";

@JsonController("/match")
export class MatchingController extends BaseController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(RealEstate)
    private readonly realEstateRepo: Repository<RealEstate>,
  ) {
    super(userRepo);
  }

  @Get("/")
  public async getActualMatches(@Req() request: Request) {
    const user = await this.getUserFromRequest(request);
    if (user.mode === UserMode.Tenant) {
      return await this.findTenantsMatches(user);
    }
    return await this.findLandlordsMatches(user);
  }

  @Post("/create")
  public async createMatch(
    @BodyParam("realEstateID") realEstateID: string,
    @BodyParam("tenantUserID") tenantUserID: string,
  ) {
    const match = this.matchRepo.create({
      realEstateID: new ObjectId(realEstateID),
      tenantUserID: new ObjectId(tenantUserID),
    });
    return await this.matchRepo.save(match);
  }

  private async findTenantsMatches(user: User) {
    const matches = await this.matchRepo.find({ tenantUserID: user.id });
    return matches.map((match) => match.realEstateID);
  }

  // TODO: Test that we can get the landlord's matches as well!
  private async findLandlordsMatches(landlord: User) {
    return await this.matchRepo.find({
      relations: ["realEstates", "matches"],
      select: ["tenantUserID"],
      where: { landlord },
    });
  }
}
