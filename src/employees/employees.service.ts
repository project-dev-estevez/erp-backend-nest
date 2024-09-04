import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import e from 'express';

@Injectable()
export class EmployeesService {

  private logger: Logger = new Logger('EmployeesService');

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    
    const { name, position, areaId } = createEmployeeDto;

    try {
      
      const employee = this.employeeRepository.create({
        name,
        position, 
        areaId
      });

      await this.employeeRepository.save(employee);
      return employee;

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const [ results, total ] = await this.employeeRepository.findAndCount({
      relations: ['area'],
      take: limit,
      skip: offset
    });

    return { results, total };

  }

  async findOne(id: string) {
    
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['area']
    });

    if(!employee)
      throw new NotFoundException(`Employee with ID:${id} not found.`);

    try {
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    
    const employee = await this.employeeRepository.preload({
      id,
      ...updateEmployeeDto
    });

    if(!employee)
      throw new NotFoundException(`Employee with ID:${id} not found`);

    try {
      await this.employeeRepository.save(employee);
      return employee;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.employeeRepository.softDelete(id);

    if(!deleteResponse.affected)
      throw new NotFoundException(`Employee with ID:${id} not found`);

  }
}
