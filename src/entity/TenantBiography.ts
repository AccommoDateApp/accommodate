import { Column, Entity } from "typeorm";
import { Biography, UserMode } from "./Biography";
import { Preference } from "./Preference";
import { RealEstateType } from "./RealEstate";

@Entity()
export class TenantBiography extends Biography {
  @Column()
  public mode: UserMode = UserMode.Tenant;

  @Column()
  public age: number = 18;

  @Column()
  public images: string[] = [
    process.env.DEFAULT_TENANT_IMAGE,
  ];

  @Column()
  public language: string = "";

  @Column()
  public education: string = "";

  @Column()
  public preferences = [
    new Preference<RealEstateType[]>("Searching for", []),
    new Preference<number>("Budget", 0),
    new Preference<number>("Lease length", 0),
    new Preference<boolean>("Onsite parking", false),
    new Preference<boolean>("Onsite storage", false),
    new Preference<boolean>("Pet friendly", false),
    new Preference<boolean>("Smoker friendly", false),
  ];
}
