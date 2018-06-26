import { Column , Entity } from "typeorm";
import { BaseEntity } from ".";
import { Bio } from "./bio";

@Entity()
export class User extends BaseEntity {
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public bio: Bio;
}
