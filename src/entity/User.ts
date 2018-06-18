import { Column , Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

export enum UserMode {
  Tenant = 0,
  Landlord = 1,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public mode: UserMode;
}
