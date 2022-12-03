import { DELETE, GET, POST, PUT, Path, PathParam } from "typescript-rest";

import ProjectHandler from '../helpers/project';

@Path('/projects')
class Project {
    projectFunctions = new ProjectHandler();

    @Path(":id")
    @GET
    getProject(@PathParam('id') id: string): any {
        return this.projectFunctions.getProject(id);
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

    @Path(":id")
    @GET
    getUserProjects(@PathParam('id') id: string): any {
        return this.projectFunctions.getDeveloperProjects(id);
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
