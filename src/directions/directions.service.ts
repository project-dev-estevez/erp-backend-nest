import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { Repository } from 'typeorm';

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
      this.handleDBErrors(error);
    }

  }

  // TODO: Implement pagination
  async findAll() {
    const [results, total] = await this.directionRepository.findAndCount({});
    return { results, total };
  }

  async findOne( id: string ) {

    const direction = await this.directionRepository.findOneBy({ id });
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
      this.handleDBErrors(error);
    }

  }

  async remove(id: string) {

    await this.findOne( id );
    await this.directionRepository.update(id, { state: false });
  }


  private handleDBErrors(error: any): never {
    
    if (error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs for more details');
  }
}
