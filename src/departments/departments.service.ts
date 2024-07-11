import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Not, Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DepartmentsService {

  private logger: Logger = new Logger('DepartmentsService');

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {

    const { name, directionId, managerId } = createDepartmentDto;

    try {
      
      const department = this.departmentRepository.create({
        name,
        direction: { id: directionId },
        manager: managerId ? { id: managerId } : null
      });

      await this.departmentRepository.save( department );
      return department;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const [ results, total ] = await this.departmentRepository.findAndCount({
      relations: ['direction', 'manager'],
      take: limit,
      skip: offset
    });

    return {
      data: results,
      total
    };

  }

  async findOne(id: string) {

    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['direction', 'manager']
    });

    if( !department )
      throw new NotFoundException(`Department whit ID:${id} not found`);

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {

    const department = await this.departmentRepository.preload({
      id,
      ...updateDepartmentDto
    });

    if( !department )
      throw new NotFoundException(`Department whit ID:${id} not found`);

    try {
      await this.departmentRepository.save( department );
      return department;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.departmentRepository.softDelete( id );
    if( !deleteResponse.affected )
      throw new NotFoundException(`Department whit ID:${id} not found`);
  }
  
}
