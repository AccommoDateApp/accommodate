import { Column } from "typeorm";
import { BaseEntity } from ".";

export enum UserMode {
  Tenant = 0,
  Landlord = 1,
}

export enum Gender {
  Male = 0,
  Female = 1,
}

export abstract class Biography extends BaseEntity {
  [key: string]: any;

  @Column()
  public name: string;

  @Column()
  public phoneNumber: string;

  @Column()
  public gender: Gender;

  @Column()
  public description: string;
}
