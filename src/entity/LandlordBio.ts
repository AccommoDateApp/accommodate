import { Column, Entity } from "typeorm";
import { Bio, UserMode } from "./Bio";
import { RealEstate } from "./RealEstate";

@Entity()
export class LandlordBio extends Bio {
  @Column()
  public mode: UserMode = UserMode.Landlord;

  @Column()
  public realEstates: RealEstate[] = [];
}
