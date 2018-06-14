import { Entity , ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  public id: ObjectID;
}
