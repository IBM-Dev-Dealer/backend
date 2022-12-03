import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import { ProjectRequirements } from "./ProjectRequirements";

@Entity({ name: 'project' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Index({unique: true})
  @Column('varchar', { length: 500 })
  projectName: string;

  @Column('varchar', { length: 1000, nullable: true })
  projectPeriod: {start: Date, end: Date};

  @Column('varchar', {length: 1000, nullable: true})
  client: string = "";

  @Column('varchar', { length: 1000, nullable: true })
  clientLogoURL: string = "";

  @Column('varchar', { length: 15000, default: [] })
  repositories: string[] = [];
  
  @Column('varchar', { length: 15000, default: [] })
  technologies: string[] = [];

  @Column('varchar', { length: 15000, default: [] })
  slackChannels: string[] = [];

  @Column('varchar', { length: 15000, default: [] })
  accessZones: string[] = [];

  @Column('varchar', { length: 15000, default: [] })
  requiredCapacity: any[] = [];

  @Column({ type: "timestamp", default: "now()" })
  createdAt: Date = new Date();

  @Column({ type: "timestamp", default: "now()" })
  updatedAt: Date = new Date();

  @OneToMany(() => ProjectRequirements, projectRequirements => Project.projectRequirements)
  static projectRequirements: ProjectRequirements;
}