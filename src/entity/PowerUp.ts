import { Column , Entity } from "typeorm";
import { BaseEntity } from ".";
import { User, UserMode } from "./User";

@Entity()
export class PowerUp extends BaseEntity {
  @Column()
  public availableFor: UserMode;

  @Column()
  public iconUrl: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public price: number;

  @Column()
  public quantities: number[] = [1];
}
