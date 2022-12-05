import { Repository, getRepository } from "typeorm";

import { NotFoundError } from "typescript-rest/dist/server/model/errors";
import { User } from "../entity/User";
import { stringifyAllProps } from "../utils";

class UserHandler {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    public async getUser(email: string): Promise<User> {
        const user = await this.repository
        .createQueryBuilder('User')
        .where('User.email = :userEmail', { userEmail: email})
        .getOne();

        if(!user) {
            throw new Error("Could not find the user profile matching the email address!");
        }

        return user;
    }

    public async getAllUsers(): Promise<User[]> {
        const allUsers = await this.repository
            .createQueryBuilder('User')
            .getMany();

        return allUsers;
    }

    public async getProjectDevelopers(projectID: number): Promise<User[]> {
        const projectDevelopers = await this.repository
            .createQueryBuilder('User')
            .where('User.projectID LIKE :projectID', { projectID: projectID })
            .getMany();

        return projectDevelopers;
    }

    public async updateUser(userEmail: string, fieldsToUpdate: Object): Promise<User[]> {
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :userEmail', { userEmail: userEmail })
            .getOne();

        if(existingUser) {
            const userToUpdate = { ...existingUser, ...fieldsToUpdate, updatedAt: new Date() };
            const updatedUser = await this.repository.save(stringifyAllProps(userToUpdate));

            if (!updatedUser) {
                throw new Error("Unable to update the user");
            }
            return updatedUser;
        }

        throw new NotFoundError("User to update not found");
    }

    public async addUser(user: User): Promise<User> {
        const newUser = await this.repository.save(stringifyAllProps(user))

        if(!newUser) {
            throw new Error("Could not add this user!");
        }
        return newUser;
    }

    public async deleteUser(email: string) {
        const existingUser = await this.repository
            .createQueryBuilder('User')
            .where('User.email = :email', { email: email })
            .getOne();

        if(existingUser) {
            const deletedUser = await this.repository.remove(existingUser);

            if (!deletedUser) {
                throw new Error("Could not delete this user!");
            }
            return deletedUser;
        }

        throw new Error("No user to delete!");
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

        throw new NotFoundError("User to update not found");
    }
}

export default UserHandler;