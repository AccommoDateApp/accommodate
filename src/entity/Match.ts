import { ObjectID } from "mongodb";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./index";

@Entity("matches")
export class Match extends BaseEntity {
  @Column()
  public tenantUserID: ObjectID;

  @Column()
  public realEstateID: ObjectID;
}
