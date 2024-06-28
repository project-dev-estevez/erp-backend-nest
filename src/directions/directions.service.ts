import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

    const { name, isGeneralDirection = false } = createDirectionDto;

    try {
      const direction = this.directionRepository.create({
        name,
        isGeneralDirection
      });

      await this.directionRepository.save(direction);

      return direction;

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  findAll() {
    return `This action returns all directions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} direction`;
  }

  update(id: number, updateDirectionDto: UpdateDirectionDto) {
    return `This action updates a #${id} direction`;
  }

  remove(id: number) {
    return `This action removes a #${id} direction`;
  }


  private handleDBErrors(error: any): never {
    
    if (error.code === '23505')
      throw new BadRequestException( error.detail );

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs for more details');
  }
}
