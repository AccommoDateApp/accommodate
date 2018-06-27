import {MatchingController} from "../../src/controllers/matching";
import {MockPersistenceProvider} from "../mock/persistence";
import {User} from "../../src/entity/User";
import {Match} from "../../src/entity/Match";
import {RealEstate} from "../../src/entity/RealEstate";
import { Repository} from "typeorm";
import {TenantBio} from "../../src/entity/TenantBio";
import {Buffer} from "buffer";

describe("The MatchingController", () => {

  let matchingController: MatchingController;
  let persistence: MockPersistenceProvider;
  let matchRepo: Repository<Match>;
  let userRepo: Repository<User>;
  let realEstateRepo: Repository<RealEstate>;

  const setUp = async (done: any) => {
    persistence = new MockPersistenceProvider();
    try {
      await persistence.bootstrap();
      await persistence.clear();

      userRepo = persistence.getRepository(User);
      realEstateRepo = persistence.getRepository(RealEstate);
      matchRepo = persistence.getRepository(Match);

      matchingController =
        new MatchingController(userRepo, matchRepo, realEstateRepo)
    } finally {
      done();
    }
  };

  const tearDown = async (done: any) => {
    try {
      await persistence.shutdown();
    } finally {
      done();
    }
  };

  beforeEach(setUp);
  afterEach(tearDown);

  it("returns the available matches.", async () => {
    const user = await addFiveMatchesToUser(userRepo, matchRepo);
    const actualMatches = await matchingController.getActualMatches({ user } as any);
    expect(actualMatches.length).toBe(5)
  });

  it("creates new matches.", async () => {
    const realEstate = await realEstateRepo.save(realEstateRepo.create());
    const realEstateID = realEstate.id.toString();
    const tenant = await userRepo.save(userRepo.create());
    const tenantUserID = tenant.id.toString();

    const initialNumMatches = await matchRepo.count();
    await matchingController.createMatch(realEstateID, tenantUserID);
    const newNumOfMatches = await matchRepo.count();

    expect(newNumOfMatches).toBe(initialNumMatches + 1);
  });
});

const addFiveMatchesToUser = async (userRepo: Repository<User>,
                                    matchRepo: Repository<Match>) => {
  const expectedNumOfMatches = 5;
  const user = await userRepo.save(userRepo.create());
  for (let i = 0; i < expectedNumOfMatches; i++) {
    const match = matchRepo.create();
    match.tenantUserID = user.id;
    await matchRepo.save(match);
  }
  return user;
};
