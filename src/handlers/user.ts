import { User } from "../entity/User";
import { DELETE, GET, POST, PUT, Path, PathParam } from "typescript-rest";

import UserHandler from '../helpers/user';

@Path('/user')
class UserMethods {
    userFunctions = new UserHandler();

    @Path(":email")
    @GET
    getUser(@PathParam('email') email: string) {
        return this.userFunctions.getUser(email);
    }

    @POST
    addUser(user: User): any {
        user.projectID = user.projectID ? JSON.parse(user.projectID) : '[]';
        return this.userFunctions.addUser(user);
    }

    @PUT
    updateUser(updateData: any): any {
        return this.userFunctions.updateUser(updateData.userEmail, updateData.fieldsToUpdate);
    }

    @DELETE
    deleteUser(user: any): any {
        return this.userFunctions.deleteUser(user.email);
    }
}


@Path('/developers')
class Developers {
    developerFunctions = new UserHandler();

    @GET
    getProjectDevelopers(projectID: any): any {
        return this.developerFunctions.getProjectDevelopers(projectID.id);
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

