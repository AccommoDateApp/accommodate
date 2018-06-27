import { Column , Entity } from "typeorm";
import { BaseEntity } from ".";
import { Biography } from "./Biography";

@Entity()
export class User extends BaseEntity {
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public bio: Biography;
}
