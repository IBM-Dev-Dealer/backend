import { Repository, getRepository } from "typeorm";

import { NotFoundError } from "typescript-rest/dist/server/model/errors";
import { Project } from "../entity/Projects";
import { ProjectRequirements } from "../entity/ProjectRequirements";
import { User } from "../entity/User";
import { stringifyAllProps } from "../utils";

class ProjectHandler {
    private repository: Repository<Project>;
    private userRepository: Repository<User>;
    private projectRepository: Repository<Project>;
    private requirementRepository: Repository<ProjectRequirements>;

    constructor() {
        this.repository = getRepository(Project);
        this.userRepository = getRepository(User);
        this.requirementRepository = getRepository(ProjectRequirements);
    }

    public async getProject(projectID: string): Promise<Project> {
        const project = await this.repository
            .createQueryBuilder('Project')
            .where('Project.id = :projectID', { projectID: projectID })
            .getOne();

        if(project) {
            project.requiredCapacity = await this.requirementRepository
                .createQueryBuilder('projectRequirements')
                .where('projectRequirements.projectName = :projectName', { projectName: project.projectName })
                .getMany();

            return project;
        }

        throw new Error("Could not find the project!");
    }

    public async updateProject(projectID: string, fieldsToUpdate: Object): Promise<Project> {
        let existingProject = await this.repository
            .createQueryBuilder('Project')
            .where('Project.id = :projectID', { projectID: projectID })
            .getOne();

        if (existingProject) {
            const projectName = existingProject.projectName;

            existingProject.requiredCapacity = await this.requirementRepository
                .createQueryBuilder('projectRequirements')
                .where('projectRequirements.projectName = :projectName', { projectName: projectName })
                .getMany();

            existingProject.requiredCapacity.map(async (capacityItemToDelete: any) => {
                await this.removeProjectRequirement(capacityItemToDelete);
            })

            var timeStampNow = new Date();
            const projectToUpdate = { ...existingProject, ...fieldsToUpdate, updatedAt: timeStampNow };

            if (projectToUpdate.requiredCapacity) {
                projectToUpdate.requiredCapacity.map(async (capacityItem: any) => {
                    await this.addProjectRequirement({
                        projectName: projectToUpdate.projectName,
                        requiredDevelopers: JSON.stringify(capacityItem.developers),
                        technology: JSON.stringify(capacityItem.technology),
                        seniorityLevel: JSON.stringify(capacityItem.seniorityLevel)
                    });
                })
            }

            let updatedProject = await this.repository.save(stringifyAllProps(projectToUpdate));
            updatedProject.requiredCapacity = projectToUpdate.requiredCapacity;

            return updatedProject;
        }

        throw new NotFoundError("Project to update not found");
    }

    public async addProject(project: any): Promise<Project> {
        if(project.requiredCapacity) {
            project.requiredCapacity.map(async (capacityItem: any) => {
                await this.addProjectRequirement({
                    projectName: project.projectName,
                    requiredDevelopers: JSON.stringify(capacityItem.developers),
                    technology: JSON.stringify(capacityItem.technology),
                    seniorityLevel: JSON.stringify(capacityItem.seniorityLevel)
                });
            })
        }
        const addedProject = await this.repository.save(stringifyAllProps(project))

        if (!addedProject) {
            throw new Error("Could not add new project!");
        }

        return addedProject;
    }

    public async addProjectRequirement(requirement: any): Promise<ProjectRequirements> {
        const newProjectRequirement = await this.requirementRepository.save(requirement)

        if (!newProjectRequirement) {
            throw new Error("Could not add new project requirements!");
        }
        return newProjectRequirement;
    }

    public async removeProjectRequirement(requirement: any): Promise<any> {
        const removedProjectRequirement = await this.requirementRepository.remove(requirement)

        if (!removedProjectRequirement) {
            throw new Error("Could not remove the project requirement!");
        }
        return removedProjectRequirement;
    }

    public async deleteProject(projectID: string): Promise<Project> {
        const existingProject = await this.repository
            .createQueryBuilder('Project')
            .where('Project.id = :projectID', { projectID: projectID })
            .getOne();

        if (existingProject) {
            const projectName = existingProject.projectName;
            existingProject.requiredCapacity = await this.requirementRepository
                .createQueryBuilder('projectRequirements')
                .where('projectRequirements.projectName = :projectName', { projectName: projectName })
                .getMany();

            const deletedProject = await this.repository.remove(existingProject);
            existingProject.requiredCapacity.map(async (capacityItemToDelete: any) => {
                await this.removeProjectRequirement(capacityItemToDelete);
            })
            return deletedProject;
        }

        throw new Error("Could delete the project!");
    }


    public async getDeveloperProjects(userID: string): Promise<Project[]> {
        const userData = await this.userRepository
            .createQueryBuilder('User')
            .where('User.id = :userID', { userID: userID })
            .getOne();

        if (userData) {
            const userProjects = await this.repository
                .createQueryBuilder('Project')
                .where('Project.id IN(:...userProjects)', { userProjects: [userData.projectID] })
                .getMany();

            return userProjects;
        }

        return [];
    }

    public async getAllProjects(): Promise<Project[]> {
        const allProjects = await this.repository
            .createQueryBuilder('Project')
            .getMany();

        return allProjects ? allProjects : [];
    }
}

export default ProjectHandler;