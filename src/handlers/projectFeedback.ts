import { ProjectFeedback } from "../entity/ProjectFeedback";
import { GET, POST, Path, PathParam } from "typescript-rest";

import ProjectFeedbackHandler from '../helpers/projectFeedback';

@Path('/project_feedback')
class project_feedback {
    projectFeedbackFunctions = new ProjectFeedbackHandler();

    @POST
    addProjectFeedback(projectFeedback: ProjectFeedback): any {
        return this.projectFeedbackFunctions.addProjectFeedback(projectFeedback);
    }

    @Path(":projectName")
    @GET
    getProjectFeedback(@PathParam('projectName') projectName: string): any {
        return this.projectFeedbackFunctions.getProjectFeedback(projectName);
    }
}

