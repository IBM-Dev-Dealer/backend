import { Logger, LoggerTypes } from '../common/Logger';
import { Repository, getRepository } from "typeorm";

import { UserFeedback } from "../entity/UserFeedback";
import { stringifyAllProps } from "../utils";

class UserFeedbackHandler {
    private repository: Repository<UserFeedback>;
    logger = new Logger();

    constructor() {
        this.repository = getRepository(UserFeedback);
    }

    public async addUserFeedback(userFeedback: UserFeedback): Promise<UserFeedback> {
        this.logger.log(`Adding user feedback for ${JSON.stringify(userFeedback)}`, LoggerTypes.info);
        const newUserFeedback = await this.repository.save(stringifyAllProps(userFeedback))

        return newUserFeedback;
    }

    public async getUserFeedback(userEmail: string): Promise<UserFeedback[]> {
        this.logger.log(`Getting user feedback for ${userEmail}`, LoggerTypes.info);
        const userFeedbackList = await this.repository
            .createQueryBuilder('UserFeedback')
            .where('UserFeedback.to = :to', { to: userEmail })
            .getMany();

        return userFeedbackList ? userFeedbackList : [];
    }
}

export default UserFeedbackHandler;