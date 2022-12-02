import { GET, POST, Path } from "typescript-rest";

import UserFeedbackHandler from '../helpers/userFeedback';

@Path('/user_feedback')
class user_feedback {
    projectFeedbackFunctions = new UserFeedbackHandler();

    @POST
    addUserFeedback(projectFeedback: Object): any {
        return this.projectFeedbackFunctions.addUserFeedback(projectFeedback);
    }

    @GET
    getUserFeedback(projectData: any): any {
        return this.projectFeedbackFunctions.getUserFeedback(projectData.to);
    }
}