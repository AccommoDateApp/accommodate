import { Column , Entity } from "typeorm";
import { BaseEntity } from ".";
import { Biography } from "./Biography";
import { PowerUp } from "./PowerUp";

export enum UserMode {
  Tenant = 0,
  Landlord = 1,
}

@Entity()
export class User extends BaseEntity {
  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public mode: UserMode;

  @Column()
  public powerups: PowerUp[] = [];

  @Column()
  public bio: Biography;
}
