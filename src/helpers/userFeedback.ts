import { Repository, getRepository } from "typeorm";

import { UserFeedback } from "../entity/UserFeedback";

class UserFeedbackHandler {
    private repository: Repository<UserFeedback>;

    constructor() {
        this.repository = getRepository(UserFeedback);
    }

    public async addUserFeedback(userFeedback: Object) {
        const newUserFeedback = await this.repository.save(userFeedback)

        return newUserFeedback;
    }

    public async getUserFeedback(userEmail: string) {
        const userFeedbackList = await this.repository
            .createQueryBuilder('UserFeedback')
            .where('UserFeedback.to = :to', { to: userEmail })
            .getMany();

        return userFeedbackList;
    }
}

export default UserFeedbackHandler;