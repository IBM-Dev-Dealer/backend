import { Repository, getRepository } from "typeorm";

import { NotFoundError } from "typescript-rest/dist/server/model/errors";
import { User } from "../entity/User";
import { error } from "console";
import { nextTick } from "process";
import { stringifyAllProps } from "../utils";

class UserHandler {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    public async getUser(email: string) {
        const user = await this.repository
        .createQueryBuilder('User')
        .where('User.email = :userEmail', { userEmail: email})
        .getOne();

        return user;
    }

    public async getAllUsers() {
        const allUsers = await this.repository
            .createQueryBuilder('User')
            .getMany();

        return allUsers;
    }

    public async getProjectDevelopers(projectID: string) {
        const projectDevelopers = await this.repository
            .createQueryBuilder('User')
            .where('User.projectID = :projectID', { projectID: projectID })
            .getMany();

        return projectDevelopers;
    }

    public async updateUser(userEmail: string, fieldsToUpdate: Object) {
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :userEmail', { userEmail: userEmail })
            .getOne();

        if(existingUser) {
            const userToUpdate = { ...existingUser, ...fieldsToUpdate, updatedAt: new Date() };
            const updatedUser = await this.repository.save(stringifyAllProps(userToUpdate));

            return updatedUser;
        }

        throw new NotFoundError("User to update not found");
    }

    public async addUser(user: Object) {
        const newUser = await this.repository.save(user)

        return newUser;
    }

    public async deleteUser(email: string) {
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :email', { email: email })
            .getOne();

        if(existingUser) {
            const deletedUser = await this.repository.remove(existingUser);
            return deletedUser;
        }

        return true;
    }

    public async getDeveloperTechStack(userID: string) {
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
        console.log('<----------->');
        console.log(userData.id);
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.id = :userID', { userID: userData.id })
            .getOne();

        if (existingUser) {
            let userToUpdate = existingUser;
            userToUpdate.techStacks = JSON.stringify(userData.techStack);
            userToUpdate.updatedAt = new Date();

            const updatedUser = await this.repository.save(userToUpdate);

            return updatedUser;
        };

        throw new NotFoundError("User to update not found");
    }
}

export default UserHandler;