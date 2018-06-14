import { Repository } from "typeorm";
import { UserController } from "../../src/controllers/user";
import { User } from "../../src/entity/User";
import { MockPersistenceProvider } from "../mock/persistence";

describe("UserController", () => {
  let controller: UserController;
  let persistence: MockPersistenceProvider;
  let repo: Repository<User>;

  beforeEach(async (done) => {
    persistence = new MockPersistenceProvider();
    await persistence.bootstrap();

    repo = persistence.getRepository(User);
    controller = new UserController(repo);

    done();
  });

  it("should give all users", async () => {
    expect.assertions(2);

    const emptyUsers = await controller.all();
    expect(emptyUsers.length).toBe(0);

    repo.insert(new User());
    const oneUser = await controller.all();
    expect(oneUser.length).toBe(1);
  });
});
