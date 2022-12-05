import { Repository, getRepository } from "typeorm";

import { UserFeedback } from "../entity/UserFeedback";
import { stringifyAllProps } from "../utils";

class UserFeedbackHandler {
    private repository: Repository<UserFeedback>;

    constructor() {
        this.repository = getRepository(UserFeedback);
    }

    public async addUserFeedback(userFeedback: UserFeedback): Promise<UserFeedback> {
        const newUserFeedback = await this.repository.save(stringifyAllProps(userFeedback))

        return newUserFeedback;
    }

    public async getUserFeedback(userEmail: string): Promise<UserFeedback[]> {
        const userFeedbackList = await this.repository
            .createQueryBuilder('UserFeedback')
            .where('UserFeedback.to = :to', { to: userEmail })
            .getMany();

        return userFeedbackList ? userFeedbackList : [];
    }
}

export default UserFeedbackHandler;