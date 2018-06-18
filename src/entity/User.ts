import { Column , Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public email: string;

  @Column()
  public password: string;
}
