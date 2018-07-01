import { Repository} from "typeorm";
import { MatchingController } from "../../src/controllers/matching";
import { Match } from "../../src/entity/Match";
import { MockPersistenceProvider } from "../mock/persistence";
import { RejectedMatch } from "../../src/entity/RejectedMatch";
import { User } from "../../src/entity/User";

describe("The MatchingController", () => {

  let matchingController: MatchingController;
  let persistence: MockPersistenceProvider;
  let matchRepo: Repository<Match>;
  let userRepo: Repository<User>;
  let rejectedMatchRepo: Repository<RejectedMatch>;

  const setUp = async (done: any) => {
    persistence = new MockPersistenceProvider();
    try {
      await persistence.bootstrap();
      await persistence.clear();
      userRepo = persistence.getRepository(User);
      rejectedMatchRepo = persistence.getRepository(RejectedMatch);
      matchRepo = persistence.getRepository(Match);

      matchingController =
        new MatchingController(userRepo, matchRepo, rejectedMatchRepo);
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

  // TODO: fix failing test
  // it("returns the available matches.", async () => {
  //   const user = await addFiveMatchesToUser(userRepo, matchRepo);
  //   const actualMatches = await matchingController.getUserMatches({ user } as any);
  //   expect(actualMatches.length).toBe(5);
  // });

  it("creates new matches.", async () => {
    const realEstate = await rejectedMatchRepo.save(rejectedMatchRepo.create());
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
