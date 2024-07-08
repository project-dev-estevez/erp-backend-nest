import { Injectable, Logger } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';

@Injectable()
export class DepartmentsService {

  private logger: Logger = new Logger('DepartmentsService');

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {

    const { name } = createDepartmentDto;

    try {
      const department = this.departmentRepository.create({ name });
      await this.departmentRepository.save(department);
      return department;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

    
  }

  findAll() {
    return `This action returns all departments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
  
}
