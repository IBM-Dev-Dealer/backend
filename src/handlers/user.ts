import { User } from "../entity/User";
import { DELETE, GET, POST, PUT, Path, PathParam } from "typescript-rest";

import UserHandler from '../helpers/user';

@Path('/user')
class UserMethods {
    userFunctions = new UserHandler();

    @Path(":email")
    @GET
    async getUser(@PathParam('email') email: string): Promise<User> {
        const user = await this.userFunctions.getUser(email);
        return user;
    }

    @POST
    async addUser(user: User): Promise<User> {
        user.projectID = user.projectID ? JSON.parse(user.projectID) : '[]';
        const addedUser = this.userFunctions.addUser(user);

        return addedUser;
    }

    @PUT
    async updateUser(updateData: any): Promise<any> {
        const updatedUser = this.userFunctions.updateUser(updateData.userEmail, updateData.fieldsToUpdate);

        return updatedUser;
    }

    @Path(":email")
    @DELETE
    async deleteUser(@PathParam('email') email: string): Promise<User> {
        const deletedUser = await this.userFunctions.deleteUser(email);

        return deletedUser;
    }
}


@Path('/developers')
class Developers {
    developerFunctions = new UserHandler();

    @Path(":projectID")
    @GET
    getProjectDevelopers(@PathParam('projectID') projectID: number): Promise<User[]> {
        const projectDevelopers = this.developerFunctions.getProjectDevelopers(projectID);

        return projectDevelopers;
    }
}

@Path('/tech_stacks')
class DevTechStacks {
    developerSkillsFunctions = new UserHandler();

    @Path(":userID")
    @GET
    getDeveloperTechStack(@PathParam('userID') userID: string): any {
        return this.developerSkillsFunctions.getDeveloperTechStack(userID);
    }

    @PUT
    updateDeveloperTechStack(userData: any): any {
        return this.developerSkillsFunctions.updateDeveloperTechStack(userData);
    }
}

@Path('/all_users')
class AllUsers {
    userFunctions = new UserHandler();

    @GET
    getAllUsers(): any {
        return this.userFunctions.getAllUsers();
    }
}

