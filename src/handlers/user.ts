import { DELETE, GET, POST, PUT, Path } from "typescript-rest";

import UserHandler from '../helpers/user';

@Path('/user')
class User {
    userFunctions = new UserHandler();

    @GET
    getUser(user: any): any {
        return this.userFunctions.getUser(user.email);
    }

    @POST
    addUser(user: Object): any {
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

    @GET
    getDeveloperTechStack(userID: any): any {
        return this.developerSkillsFunctions.getDeveloperTechStack(userID.id);
    }

    @PUT
    updateDeveloperTechStack(userData: any): any {
        return this.developerSkillsFunctions.updateDeveloperTechStack(userData);
    }
}

