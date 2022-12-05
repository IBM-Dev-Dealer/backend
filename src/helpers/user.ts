import { Logger, LoggerTypes } from '../common/logger';
import { Repository, getRepository } from "typeorm";

import { User } from "../entity/User";
import { stringifyAllProps } from "../utils";

class UserHandler {
    private repository: Repository<User>;
    logger = new Logger();

    constructor() {
        this.repository = getRepository(User);
    }

    public async getUser(email: string): Promise<User> {
        this.logger.log(`Getting user for ${email}`, LoggerTypes.info);

        const user = await this.repository
        .createQueryBuilder('User')
        .where('User.email = :userEmail', { userEmail: email})
        .getOne();

        if(!user) {
            this.logger.log(`Could not find the user profile matching the ${email} email address!`, LoggerTypes.error);
            throw new Error("Could not find the user profile matching the email address!");
        }

        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        this.logger.log(`Getting all users`, LoggerTypes.info);
        const allUsers = await this.repository
            .createQueryBuilder('User')
            .getMany();

        return allUsers;
    }

    public async getProjectDevelopers(projectID: number): Promise<User[]> {
        this.logger.log(`Getting project developers for ${projectID}`, LoggerTypes.info);
        const projectDevelopers = await this.repository
            .createQueryBuilder('User')
            .where('User.projectID LIKE :projectID', { projectID: projectID })
            .getMany();

        return projectDevelopers;
    }

    public async updateUser(userEmail: string, fieldsToUpdate: Object): Promise<User> {
        this.logger.log(`Updating user ${userEmail} fields ${JSON.stringify(fieldsToUpdate)}`, LoggerTypes.info);
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :userEmail', { userEmail: userEmail })
            .getOne();

        if(existingUser) {
            const userToUpdate = { ...existingUser, ...fieldsToUpdate, updatedAt: new Date() };
            const updatedUser = await this.repository.save(stringifyAllProps(userToUpdate));

            if (!updatedUser) {
                this.logger.log(`Could not update the user profile matching the ${userEmail} email address!`, LoggerTypes.error);
                throw new Error("Unable to update the user");
            }
            return updatedUser;
        }

        this.logger.log(`Could not find the user profile matching the ${userEmail} email address!`, LoggerTypes.error);
        throw new Error("User to update not found");
    }

    public async addUser(user: User): Promise<User> {
        this.logger.log(`Adding user ${JSON.stringify(user)}`, LoggerTypes.info);
        const newUser = await this.repository.save(stringifyAllProps(user))

        if(!newUser) {
            this.logger.log(`Could not find the user profile matching the ${JSON.stringify(user)} data!`, LoggerTypes.error);
            throw new Error("Could not add this user!");
        }
        return newUser;
    }

    public async deleteUser(email: string) {
        this.logger.log(`Deleting user with email ${email} }`, LoggerTypes.info);
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :email', { email: email })
            .getOne();

        if(existingUser) {
            const deletedUser = await this.repository.remove(existingUser);

            if (!deletedUser) {
                this.logger.log(`Could not delete the user matching the ${email} email address!`, LoggerTypes.error);
                throw new Error("Could not delete this user!");
            }
            return deletedUser;
        }

        this.logger.log(`Could not find the user profile matching the ${email} email address!`, LoggerTypes.error);
        throw new Error("No user to delete!");
    }

    public async getDeveloperTechStack(userID: string) {
        this.logger.log(`Getting tech stacks for ${userID}`, LoggerTypes.info);
        const userData = await this.repository
            .createQueryBuilder('User')
            .where('User.id = :userID', { userID: userID })
            .getOne();

        if(userData) {
            return userData.techStacks;
        }

        return [];
    }

    public async updateDeveloperTechStack(userData: any) {
        this.logger.log(`Updating developer tech stacks ${JSON.stringify(userData)}`, LoggerTypes.info);
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.id = :userID', { userID: userData.id })
            .getOne();

        if (existingUser) {
            let userToUpdate = existingUser;
            userToUpdate.techStacks = JSON.stringify(userData.techStack);
            userToUpdate.updatedAt = new Date();

            const updatedUser = await this.repository.save(stringifyAllProps(userToUpdate));

            return updatedUser;
        };

        this.logger.log(`Could not find the user profile matching the ${userData.id} ID!`, LoggerTypes.error);
        throw new Error("User to update not found");
    }
}

export default UserHandler;