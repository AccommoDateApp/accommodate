import { Column, Entity } from "typeorm";
import { BaseEntity } from ".";

@Entity()
export class Location extends BaseEntity {
  @Column()
  public address: string = "";

  @Column()
  public area: string = "";

  @Column()
  public latitude: number = 0;

  @Column()
  public longitude: number = 0;
}
