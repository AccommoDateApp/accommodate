import { Repository } from "typeorm";
import { UserController } from "../../src/controllers/user";
import { UserMode } from "../../src/entity/Biography";
import { User } from "../../src/entity/User";
import { JWTProvider } from "../../src/providers/jwt";
import { MockPersistenceProvider } from "../mock/persistence";

describe("UserController", () => {
  let controller: UserController;
  let persistence: MockPersistenceProvider;
  let repo: Repository<User>;
  let jwt: JWTProvider;

  beforeEach(async (done) => {
    persistence = new MockPersistenceProvider();
    try {
      await persistence.bootstrap();
      await persistence.clear();

      jwt = new JWTProvider();
      await jwt.bootstrap();

      repo = persistence.getRepository(User);
      controller = new UserController(repo, jwt);
    } finally {
      done();
    }
  });

  afterEach(async (done) => {
    try {
      await persistence.shutdown();
    } finally {
      done();
    }
  });

  it("creates users", async () => {
    expect.assertions(2);

    const initialUserCount = await repo.count();
    expect(initialUserCount).toBe(0);

    await controller.signup("foo@bar.com", "foobar", UserMode.Tenant);

    const finalUserCount = await repo.count();
    expect(finalUserCount).toBe(1);
  });

  it("creates login token", async () => {
    expect.assertions(1);

    const email = "foo@bar.com";
    const password = "foobar";

    await controller.signup(email, password, UserMode.Tenant);

    const token = await controller.login(email, password);
    expect(token).not.toBe("");
  });
});
