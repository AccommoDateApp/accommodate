import { Column, Entity } from "typeorm";
import { BaseEntity } from ".";

@Entity()
export class Preference<T = any> extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public value: T;

  constructor(name: string = "", value: T = null) {
    super();

    this.name = name;
    this.value = value;
  }
}
