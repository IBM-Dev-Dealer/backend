import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum userFeedbackLevel {
    expectMore = 'Expect More',
    achieves = 'Achieves',
    exceeds = 'Exceeds'
}

@Entity({ name: 'user_feedback' })
export class UserFeedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100, nullable: false })
    projectName: string;

    @Column('varchar', { length: 100, nullable: false })
    projectID: string;

    @Column('varchar', { length: 100 })
    to: string;

    @Column({
        type: 'enum',
        enum: userFeedbackLevel,
        default: userFeedbackLevel.expectMore
    })
    businessResults: userFeedbackLevel;

    @Column({
        type: 'enum',
        enum: userFeedbackLevel,
        default: userFeedbackLevel.expectMore
    })
    clientSuccess: userFeedbackLevel;

    @Column({
        type: 'enum',
        enum: userFeedbackLevel,
        default: userFeedbackLevel.expectMore
    })
    innovation: userFeedbackLevel;

    @Column('varchar', { length: 1 })
    teamInteractionRating: string;

    @Column('varchar')
    suggestedSeniorityLevels: string;

    @Column('varchar', { length: 15000 })
    additionalFeedback: string;

    @Column({ type: "timestamptz", default: "now()" })
    createdAt: Date = new Date();

    @Column({ type: "timestamptz", default: "now()" })
    updatedAt: Date = new Date();
}