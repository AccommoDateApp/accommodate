import { Request } from "express";
import { ObjectId } from "mongodb";
import { BodyParam, Get, JsonController, Post, Req } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserMode } from "../entity/Biography";
import { LandlordBiography } from "../entity/LandlordBiography";
import { Match } from "../entity/Match";
import { RealEstate } from "../entity/RealEstate";
import { RejectedMatch } from "../entity/RejectedMatch";
import { TenantBiography } from "../entity/TenantBiography";
import { User } from "../entity/User";
import { BaseController } from "./index";

@JsonController("/match")
export class MatchingController extends BaseController {
  constructor(
    @InjectRepository(User)
    protected readonly users: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(RejectedMatch)
    private readonly rejectedMatchRepo: Repository<RejectedMatch>,
  ) {
    super(users);
  }

  @Get("/")
  public async getUserMatches(@Req() request: Request) : Promise<UserMatches<any>> {
    try {
      const user = await this.getUserFromRequest(request);
      if (user.mode === UserMode.Tenant) {
        return await this.findTenantsUserMatches(user);
      }
      return await this.findLandlordsUserMatches(user);
    } catch {
      return {
        actualMatches: [],
        potentialMatches: [],
      };
    }
  }

  @Post("/create")
  public async createMatch(
    @BodyParam("realEstateID") realEstateID: string,
    @BodyParam("tenantUserID") tenantUserID: string,
  ) {
    const match = this.matchRepo.create();
    match.realEstateID = new ObjectId(realEstateID);
    match.tenantUserID = new ObjectId(tenantUserID);
    await this.matchRepo.save(match);
    return true;
  }

  @Post("/reject")
  public async rejectMatch(
    @BodyParam("realEstateID") realEstateID: string,
    @BodyParam("tenantUserID") tenantUserID: string,
  ) {
    const match = this.rejectedMatchRepo.create();
    match.realEstateID = new ObjectId(realEstateID);
    match.tenantUserID = new ObjectId(tenantUserID);
    await this.rejectedMatchRepo.save(match);
    return true;
  }

  private async findTenantsUserMatches(user: User) : Promise<UserMatches<RealEstate>> {
    const allMatches = await this.matchRepo.find();
    const actualMatches = allMatches.filter(
      (match) => new ObjectId(match.tenantUserID).toHexString() === new ObjectId(user.bio.id).toHexString(),
    );

    const actualRealEstateIDs = new Set(actualMatches.map(
      (match) => new ObjectId(match.realEstateID).toHexString()),
    );

    const allLandlords = await this.users.find({ mode: UserMode.Landlord });
    const allRealEstates: RealEstate[] = [];
    for (const landlord of allLandlords) {
      allRealEstates.push(...(landlord.bio as LandlordBiography).realEstates);
    }

    const actualRealEstates = allRealEstates
      .filter((realEstate) => actualRealEstateIDs.has(new ObjectId(realEstate.id).toHexString()));
    const potentialRealEstates = allRealEstates
      .filter((realEstate) => !actualRealEstateIDs.has(new ObjectId(realEstate.id).toHexString()));

    return {
      actualMatches: actualRealEstates,
      potentialMatches: potentialRealEstates,
    };
  }

  private async findLandlordsUserMatches(landlord: User) : Promise<UserMatches<TenantBiography>> {
    const landlordsRealEstateIDs = (landlord.bio as LandlordBiography)
      .realEstates.map((realEstate) => new ObjectId(realEstate.id).toHexString());
    const landlordsRealEstateIDsSet = new Set(landlordsRealEstateIDs);
    const allMatches = await this.matchRepo.find();
    const actualMatches = allMatches.filter(
      (match) => landlordsRealEstateIDsSet.has(match.realEstateID.toHexString()),
    );

    const actualTenantsIDsSet = new Set(actualMatches.map(
      (match) => new ObjectId(match.tenantUserID).toHexString(),
    ));

    const allTenants = await this.users.find({ mode: UserMode.Tenant });

    const actualTenants = allTenants.filter(
      (tenant) => actualTenantsIDsSet.has(new ObjectId(tenant.bio.id).toHexString()),
    );

    const actualTenantsBiographies = actualTenants
      .map((user) => user.bio as TenantBiography);

    const potentialTenants = allTenants.filter(
      (tenant) => !actualTenantsIDsSet.has(new ObjectId(tenant.bio.id).toHexString()),
    );
    const potentialMatchesBiographies = potentialTenants
      .map((match) => match.bio as TenantBiography);

    return {
      actualMatches: actualTenantsBiographies,
      potentialMatches: potentialMatchesBiographies,
    };
  }
}

interface UserMatches<T extends (RealEstate | TenantBiography)> {
  actualMatches: T[];
  potentialMatches: T[];
}
