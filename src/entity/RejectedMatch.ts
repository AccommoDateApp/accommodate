import { ObjectID } from "mongodb";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./index";

@Entity("rejectedMatches")
export class RejectedMatch extends BaseEntity {
  @Column()
  public tenantUserID: ObjectID;

  @Column()
  public realEstateID: ObjectID;
}
