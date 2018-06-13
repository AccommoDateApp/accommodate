import { Get, JsonController, Param } from "routing-controllers";
import { User } from "../entity/User";
import { PersistenceProvider, Repository} from "../providers/persistence";

@JsonController("/users")
export class UserController {
  private readonly repo: Repository<User>;

  constructor(persistence: PersistenceProvider) {
    this.repo = persistence.getRepository(User);
  }

  @Get()
  public all() {
    return this.repo.find();
  }

  @Get("/:id")
  public findById(@Param("id") id: string) {
    return this.repo.findByIds([
      id,
    ]);
  }
}
