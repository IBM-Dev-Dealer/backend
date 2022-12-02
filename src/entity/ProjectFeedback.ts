import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'project_feedback' })
export class ProjectFeedback {
    @PrimaryColumn('varchar', { length: 500, unique: false })
    from: string;

    @Column('varchar', { length: 100, nullable: false })
    projectName: string;

    @Column('varchar', { length: 1 })
    rating: string;

    @Column('varchar', { length: 15000, default: '' })
    pros: string;

    @Column('varchar', { length: 15000, default: '' })
    cons: string;

    @Column({ type: "timestamp", default: "now()" })
    createdAt: Date = new Date();

    @Column({ type: "timestamp", default: "now()" })
    updatedAt: Date = new Date();
}