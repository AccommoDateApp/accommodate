import { Repository } from "typeorm";
import { PowerUpsController } from "../../src/controllers/powerups";
import { PowerUp } from "../../src/entity/PowerUp";
import { User, UserMode } from "../../src/entity/User";
import { MockPersistenceProvider } from "../mock/persistence";

describe("PowerUpsController", () => {
  let controller: PowerUpsController;
  let persistence: MockPersistenceProvider;
  let userRepo: Repository<User>;
  let powerupsRepo: Repository<PowerUp>;
  let user: User;
  let request: any;

  beforeAll(async (done) => {
    try {
      persistence = new MockPersistenceProvider();
      await persistence.bootstrap();
    } catch (error) {
      console.error(error);
    } finally {
      done();
    }
  });

  afterAll(async (done) => {
    try {
      await persistence.shutdown();
    } finally {
      done();
    }
  });

  beforeEach(async (done) => {
    try {
      await persistence.clear();

      userRepo = persistence.getRepository(User);

      user = userRepo.create();
      user.mode = UserMode.Tenant;
      await userRepo.save(user);

      request = {
        user,
      };

      powerupsRepo = persistence.getRepository(PowerUp);

      controller = new PowerUpsController(userRepo, powerupsRepo);
    } finally {
      done();
    }
  });

  afterEach(async (done) => {
    try {
      await persistence.clear();
    } finally {
      done();
    }
  });

  it("gets all powerups", async () => {
    expect.assertions(1);

    const count = 10;

    for (let i = 0; i < count; i++) {
      const powerup = powerupsRepo.create();
      powerup.availableFor = user.mode;

      await powerupsRepo.save(powerup);
    }

    const powerups = await controller.getAvailablePowerUps(request);

    expect(powerups.length).toBe(count);
  });

  it("filters powerups according to the user's mode", async () => {
    expect.assertions(1);

    const powerup = powerupsRepo.create();
    powerup.availableFor = UserMode.Landlord;
    await powerupsRepo.save(powerup);

    user.mode = UserMode.Tenant;
    await userRepo.save(user);

    const powerups = await controller.getAvailablePowerUps(request);
    expect(powerups.length).toBe(0);
  });

  it("adds powerups to the user's powerups", async () => {
    expect.assertions(2);

    const powerup = powerupsRepo.create();
    await powerupsRepo.save(powerup);

    const userPowerups = await controller.buyPowerUp(request, powerup.id + "");
    expect(userPowerups.length).toBe(1);

    user = await userRepo.findOne();
    expect(user.powerups.length).toBe(1);
  });

  it("removes powerups from the user's powerups", async () => {
    expect.assertions(2);

    const powerup = powerupsRepo.create();
    await powerupsRepo.save(powerup);

    user.powerups.push(powerup);
    await userRepo.save(user);

    const userPowerups = await controller.removePowerUp(request, powerup.id + "");
    expect(userPowerups.length).toBe(0);

    user = await userRepo.findOne();
    expect(user.powerups.length).toBe(0);
  });
});
