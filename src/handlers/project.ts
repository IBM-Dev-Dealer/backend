import { DELETE, GET, POST, PUT, Path } from "typescript-rest";

import ProjectHandler from '../helpers/project';

@Path('/projects')
class Project {
    projectFunctions = new ProjectHandler();

    @GET
    getProject(project: any): any {
        return this.projectFunctions.getProject(project.id);
    }

    @POST
    addProject(project: Object): any {
        return this.projectFunctions.addProject(project);
    }

    @PUT
    updateProject(updateData: any): any {
        return this.projectFunctions.updateProject(updateData.projectID, updateData.fieldsToUpdate);
    }

    @DELETE
    deleteProject(project: any): any {
        return this.projectFunctions.deleteProject(project.projectID);
    }
}

@Path('/user_projects')
class UserProjects {
    projectFunctions = new ProjectHandler();

    @GET
    getUserProjects(userID: any): any {
        return this.projectFunctions.getDeveloperProjects(userID.id);
    }
}

@Path('/all_projects')
class AllProjects {
    projectFunctions = new ProjectHandler();

    @GET
    getAllProjects(project: any): any {
        return this.projectFunctions.getAllProjects();
    }
}
