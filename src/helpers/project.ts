import { Repository, getRepository } from "typeorm";

import { NotFoundError } from "typescript-rest/dist/server/model/errors";
import { Project } from "../entity/Projects";
import { ProjectRequirements } from "../entity/ProjectRequirements";
import { User } from "../entity/User";

class ProjectHandler {
    private repository: Repository<Project>;
    private userRepository: Repository<User>;
    private requirementRepository: Repository<ProjectRequirements>;

    constructor() {
        this.repository = getRepository(Project);
        this.userRepository = getRepository(User);
        this.requirementRepository = getRepository(ProjectRequirements);
    }

    public async getProject(projectID: string) {
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
    }

    public async updateProject(projectID: string, fieldsToUpdate: Object) {
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

            var timeStampNow = new Date().toISOString();
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

            let updatedProject = await this.repository.save(projectToUpdate);
            updatedProject.requiredCapacity = projectToUpdate.requiredCapacity;

            return updatedProject;
        }

        throw new NotFoundError("Project to update not found");
    }

    public async addProject(project: any) {
        console.log(JSON.stringify(project, null, '\t'));
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
        const newProject = await this.repository.save(project)

        return newProject;
    }

    public async addProjectRequirement(requirement: any) {
        console.log(JSON.stringify(requirement, null, '\t'));
        const newProjectRequirement = await this.requirementRepository.save(requirement)

        return newProjectRequirement;
    }

    public async removeProjectRequirement(requirement: any) {
        console.log(JSON.stringify(requirement, null, '\t'));
        const removedProjectRequirement = await this.requirementRepository.remove(requirement)

        return removedProjectRequirement;
    }

    public async deleteProject(projectID: string) {
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

        return true;
    }

    public async getDeveloperProjects(userID: string) {
        const userData = await this.userRepository
            .createQueryBuilder('User')
            .where('User.id = :userID', { userID: userID })
            .getOne();

            if(userData) {
                const userProjects = await this.repository
                    .createQueryBuilder('Project')
                    .where('Project.id IN(:...userProjects)', { userProjects: [userData.projectID] })
                    .getMany();

                return userProjects;
            }

        return [];
    }
}

export default ProjectHandler;