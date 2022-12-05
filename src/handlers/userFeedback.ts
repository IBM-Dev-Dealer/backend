import { UserFeedback } from "../entity/UserFeedback";
import { GET, POST, Path, PathParam } from "typescript-rest";

import UserFeedbackHandler from '../helpers/userFeedback';

@Path('/user_feedback')
class user_feedback {
    projectFeedbackFunctions = new UserFeedbackHandler();

    @POST
    addUserFeedback(projectFeedback: UserFeedback): any {
        return this.projectFeedbackFunctions.addUserFeedback(projectFeedback);
    }

    @Path(":to")
    @GET
    getUserFeedback(@PathParam('to') to: string): any {
        return this.projectFeedbackFunctions.getUserFeedback(to);
    }
}