import { Column, Entity } from "typeorm";
import { BaseEntity } from ".";
import { Location } from "./Location";
import { Preference } from "./Preference";

export enum RealEstateType {
  WG = 0,
  Apartment = 1,
  House = 2,
}

@Entity()
export class RealEstate extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public type: RealEstateType;

  @Column()
  public location: Location;

  @Column()
  public images: string[] = [];

  @Column()
  public rent: number;

  @Column()
  public preferences: Preference[] = [
    new Preference<number>("Distance to Uni", 0),
    new Preference<boolean>("Onsite parking", false),
    new Preference<boolean>("Onsite storage", false),
    new Preference<boolean>("Pet friendly", false),
  ];
}
