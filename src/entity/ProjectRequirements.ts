import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'projectRequirements' })
export class ProjectRequirements {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Index({})
    @Column('varchar', { length: 500 })
    projectName: string;

    @Column('varchar', { length: 500 })
    requiredDevelopers: string;

    @Column('varchar', { length: 500 })
    technology: string;

    @Column('varchar', { length: 500 })
    seniorityLevel: string;
}