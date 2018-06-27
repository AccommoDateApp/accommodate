import { Column, Entity } from "typeorm";
import { BaseEntity } from ".";

@Entity()
export class Location extends BaseEntity {
  @Column()
  public address: string;

  @Column()
  public area: string;

  @Column()
  public latitude: number;

  @Column()
  public longitude: number;
}
