import { Repository, getRepository } from "typeorm";

import { ProjectFeedback } from "../entity/ProjectFeedback";

class ProjectFeedbackHandler {
    private repository: Repository<ProjectFeedback>;

    constructor() {
        this.repository = getRepository(ProjectFeedback);
    }

    public async addProjectFeedback(projectFeedback: Object) {
        const newProjectFeedback = await this.repository.save(projectFeedback)

        return newProjectFeedback;
    }

    public async getProjectFeedback(projectName: string) {
        const projectFeedbackList = await this.repository
            .createQueryBuilder('ProjectFeedback')
            .where('ProjectFeedback.projectName = :projectName', { projectName: projectName })
            .getMany();

        return projectFeedbackList;
    }
}

export default ProjectFeedbackHandler;