import { Column, Entity } from "typeorm";
import { Biography, UserMode } from "./Bio";
import { RealEstate } from "./RealEstate";

@Entity()
export class LandlordBio extends Biography {
  @Column()
  public mode: UserMode = UserMode.Landlord;

  @Column()
  public realEstates: RealEstate[] = [];
}
