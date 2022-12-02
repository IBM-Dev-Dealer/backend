import { GET, POST, Path } from "typescript-rest";

import ProjectFeedbackHandler from '../helpers/projectFeedback';

@Path('/project_feedback')
class project_feedback {
    projectFeedbackFunctions = new ProjectFeedbackHandler();

    @POST
    addProjectFeedback(projectFeedback: Object): any {
        return this.projectFeedbackFunctions.addProjectFeedback(projectFeedback);
    }

    @GET
    getProjectFeedback(projectData: any): any {
        return this.projectFeedbackFunctions.getProjectFeedback(projectData.projectName);
    }
}

