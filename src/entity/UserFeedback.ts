import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum userFeedbackLevelList {
    expectMore = 'Expect more',
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
        enum: userFeedbackLevelList,
        default: userFeedbackLevelList.expectMore
    })
    businessResults: userFeedbackLevelList;

    @Column({
        type: 'enum',
        enum: userFeedbackLevelList,
        default: userFeedbackLevelList.expectMore
    })
    clientSuccess: userFeedbackLevelList;

    @Column({
        type: 'enum',
        enum: userFeedbackLevelList,
        default: userFeedbackLevelList.expectMore
    })
    innovation: userFeedbackLevelList;

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