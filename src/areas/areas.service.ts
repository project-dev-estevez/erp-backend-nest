import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';

@Injectable()
export class AreasService {

  private logger: Logger = new Logger('AreasService');

  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    
    const { name, coordinatorId, leaderId, departmentId } = createAreaDto;

    try {
      
      const area = this.areaRepository.create({
        name,
        coordinator: { id: coordinatorId },
        leader: { id: leaderId },
        department: { id: departmentId }
      });

      await this.areaRepository.save(area);
      return area;

    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async findAll( paginationDto: PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const [ results, total ] = await this.areaRepository.findAndCount({
      relations: ['coordinator', 'leader', 'department'],
      take: limit,
      skip: offset
    });
    return { results, total };

  }

  async findOne(id: string) {
    
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['coordinator', 'leader', 'department']
    });

    if(!area)
      throw new NotFoundException(`Area with ID:${id} not found`);

    try {
      await this.areaRepository.save(area);
      return area;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    
    const area = await this.areaRepository.preload({
      id,
      ...updateAreaDto
    });

    if(!area)
      throw new NotFoundException(`Area with ID:${id} not found`);

    try {
      await this.areaRepository.save(area);
      return area;
    } catch (error) {
      return handleDBErrors(error, this.logger);      
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.areaRepository.softDelete(id);

    if(!deleteResponse.affected)
      throw new NotFoundException(`Area with ID:${id} not found`);

  }
}
