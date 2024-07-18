import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';

@Injectable()
export class DirectionsService {

  private logger: Logger = new Logger('DirectionsService');

  constructor(
    @InjectRepository(Direction)
    private readonly directionRepository: Repository<Direction>
  ) { }

  async create(createDirectionDto: CreateDirectionDto) {

    const { enterpriseId, directorId } = createDirectionDto;

    try {
      const direction = this.directionRepository.create({
        ...createDirectionDto,
        enterprise: { id: enterpriseId },
        director: { id: directorId }
      });
    
      await this.directionRepository.save(direction);
    
      return direction;
    } catch (error) {
      handleDBErrors( error, this.logger );
    }

  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const [results, total] = await this.directionRepository.findAndCount({
      where: { state: true },
      relations: ['enterprise', 'director'],
      take: limit,
      skip: offset
    });
    return { results, total };
  }

  async findOne( id: string ) {

    const direction = await this.directionRepository.findOne({
      where: { id, state: true },
      relations: ['enterprise', 'director'],
    });

    if( !direction )
      throw new NotFoundException(`Direction with id ${id} not found`);

    return direction;
  }

  async update(id: string, updateDirectionDto: UpdateDirectionDto) {

    const direction = await this.directionRepository.preload({
      id,
      ...updateDirectionDto
    });

    if( !direction )
      throw new NotFoundException(`Direction with id ${id} not found`);

    try {
      await this.directionRepository.save(direction);
      return direction;
    } catch (error) {
      handleDBErrors( error, this.logger );
    }

  }

  async remove(id: string) {
    
    const deleteResponse = await this.directionRepository.softDelete( id );
    if( !deleteResponse.affected )
      throw new NotFoundException(`Direction with ID:${id} not found`);
  }

}
