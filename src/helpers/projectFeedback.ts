import { Repository, getRepository } from "typeorm";

import { ProjectFeedback } from "../entity/ProjectFeedback";

class ProjectFeedbackHandler {
    private repository: Repository<ProjectFeedback>;

    constructor() {
        this.repository = getRepository(ProjectFeedback);
    }

    public async addProjectFeedback(projectFeedback: ProjectFeedback): Promise<ProjectFeedback> {
        const newProjectFeedback = await this.repository.save(projectFeedback)

        if(!newProjectFeedback) {
            throw new Error("Could not add the feedback!");
        }

        return newProjectFeedback;
    }

    public async getProjectFeedback(projectName: string): Promise<ProjectFeedback[]> {
        const projectFeedbackList = await this.repository
            .createQueryBuilder('ProjectFeedback')
            .where('ProjectFeedback.projectName = :projectName', { projectName: projectName })
            .getMany();

        return projectFeedbackList;
    }
}

export default ProjectFeedbackHandler;