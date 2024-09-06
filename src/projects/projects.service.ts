import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProjectsService {

  private logger: Logger = new Logger('ProjectsService');

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async create(createProjectDto: CreateProjectDto) {

    const { name, customerId, enterpriseId } = createProjectDto;

    try {
      
      const project = this.projectRepository.create({
        name,
        customerId,
        enterpriseId
      });

      await this.projectRepository.save(project);
      return project;

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const [ results, total ] = await this.projectRepository.findAndCount({
      relations: ['customer','enterprise'],
      take: limit,
      skip: offset
    });

    return { results, total };

  }

  async findOne(id: string) {
    
    const project = await this.projectRepository.findOne({
      where: {id},
      relations: ['customer', 'enterprise']
    });

    if(!project)
      throw new NotFoundException(`Project with ID:${id} not found`);

    try {
      
      await this.projectRepository.save(project);
      return(project);

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    
    const project = await this.projectRepository.preload({
      id,
      ...updateProjectDto
    });

    if(!project)
      throw new NotFoundException(`Project with ID:${id} not found`);
    
    try {
      
      await this.projectRepository.save(project);
      return project;

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.projectRepository.softDelete(id);

    if(!deleteResponse.affected)
      throw new NotFoundException(`Project with ID:${id} not found`);

  }
}
