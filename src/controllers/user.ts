import { Get, JsonController, Param } from "routing-controllers";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/User";

@JsonController("/users")
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) { }

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
