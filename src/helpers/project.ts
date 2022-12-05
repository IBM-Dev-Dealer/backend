import { Logger, LoggerTypes } from '../common/logger';
import { Repository, getRepository } from "typeorm";

import { Project } from "../entity/Projects";
import { ProjectRequirements } from "../entity/ProjectRequirements";
import { User } from "../entity/User";
import { stringifyAllProps } from "../utils";

class ProjectHandler {
    private repository: Repository<Project>;
    private userRepository: Repository<User>;
    private projectRepository: Repository<Project>;
    private requirementRepository: Repository<ProjectRequirements>;
    logger = new Logger();

    constructor() {
        this.repository = getRepository(Project);
        this.userRepository = getRepository(User);
        this.requirementRepository = getRepository(ProjectRequirements);
    }

    public async getProject(projectID: string): Promise<Project> {
        this.logger.log(`Getting project for ${projectID}`, LoggerTypes.info);
        const project = await this.repository
            .createQueryBuilder('Project')
            .where('Project.id = :projectID', { projectID: projectID })
            .getOne();

        if(project) {
            this.logger.log(`Getting required capacity for ${projectID}`, LoggerTypes.info);
            project.requiredCapacity = await this.requirementRepository
                .createQueryBuilder('projectRequirements')
                .where('projectRequirements.projectName = :projectName', { projectName: project.projectName })
                .getMany();

            return project;
        }

        this.logger.log(`Could not find the project matching the ${projectID} ID!`, LoggerTypes.error);
        throw new Error("Could not find the project!");
    }

    public async updateProject(projectID: string, fieldsToUpdate: Object): Promise<Project> {
        this.logger.log(`Updating project for ${projectID} ID with parameters ${fieldsToUpdate}`, LoggerTypes.info);
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

        this.logger.log(`Could not find the project matching the ${projectID} ID to update!`, LoggerTypes.error);
        throw new Error("Project to update not found");
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
        this.logger.log(`Adding project requirements ${JSON.stringify(requirement)}`, LoggerTypes.info);
        const newProjectRequirement = await this.requirementRepository.save(requirement)

        if (!newProjectRequirement) {
            this.logger.log(`Could not add the new project requirements ${JSON.stringify(requirement)}`, LoggerTypes.error);
            throw new Error("Could not add new project requirements!");
        }
        return newProjectRequirement;
    }

    public async removeProjectRequirement(requirement: any): Promise<any> {
        this.logger.log(`Removing project requirements ${JSON.stringify(requirement)}`, LoggerTypes.info);
        const removedProjectRequirement = await this.requirementRepository.remove(requirement)

        if (!removedProjectRequirement) {
            this.logger.log(`Could not remove the project requirements ${JSON.stringify(requirement)}`, LoggerTypes.error);
            throw new Error("Could not remove the project requirement!");
        }
        return removedProjectRequirement;
    }

    public async deleteProject(projectID: string): Promise<Project> {
        this.logger.log(`Remove project with ID ${projectID}`, LoggerTypes.info);
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

        this.logger.log(`Could not delete the project ${projectID}`, LoggerTypes.error);
        throw new Error("Could not delete the project!");
    }


    public async getDeveloperProjects(userID: string): Promise<Project[]> {
        this.logger.log(`Getting developer projects for ${userID}`, LoggerTypes.info);
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
        this.logger.log(`Getting all projects`, LoggerTypes.info);
        const allProjects = await this.repository
            .createQueryBuilder('Project')
            .getMany();

        return allProjects ? allProjects : [];
    }
}

export default ProjectHandler;