import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({unique: true})
  @Column('varchar', { length: 500})
  email: string;

  @Column('varchar', {length: 1000})
  password: string;

  @Column('varchar', { length: 50 })
  firstName: string;

  @Column('varchar', { length: 50 })
  lastName: string;

  @Column('varchar', { length: 15000, nullable: true })
  photo: string = "";

  @Column('varchar', { length: 100, nullable: true })
  phone: string = "";

  @Column('varchar', { length: 15000, nullable: true })
  techStacks: string = "";

  @Column('text', { nullable: true })
  about: string = "";

  @Column('varchar', { length: 1500, nullable: true })
  projectID: string = "";

  @Column({ type: "timestamp", default: "now()" })
  createdAt: Date = new Date();

  @Column({ type: "timestamp", default: "now()" })
  updatedAt: Date = new Date();
}
