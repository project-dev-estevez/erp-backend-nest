import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Enterprise } from './entities/enterprise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';

@Injectable()
export class EnterprisesService {

  private logger: Logger = new Logger('EnterprisesService');

  constructor(
    @InjectRepository(Enterprise)
    private readonly directionRepository: Repository<Enterprise>
  ) {}

  async create(createEnterpriseDto: CreateEnterpriseDto) {

    const { name, ceoId } = createEnterpriseDto;

    try{

      const enterprise = this.directionRepository.create({
        name,
        ceo: { id: ceoId }
      });

      await this.directionRepository.save( enterprise );
      return enterprise;
    }catch (error) {
      return handleDBErrors(error, this.logger);
    }
    
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const [results, total] = await this.directionRepository.findAndCount({
      relations: ['ceo'],
      take: limit,
      skip: offset
    });
    return { results, total };

  }

  async findOne(id: string) {
    
    const enterprise = await this.directionRepository.findOne({
      where: { id },
      relations: ['ceo']
    });

    if(!enterprise)
      throw new NotFoundException(`Enterprise with ID:${id} not found`);

    try{
      await this.directionRepository.save( enterprise );
      return enterprise;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    
    const enterprise = await this.directionRepository.preload({
      id,
      ...updateEnterpriseDto
    });

    if( !enterprise )
      throw new NotFoundException(`Enterprise with ID:${id} not found`);

    try {
      await this.directionRepository.save( enterprise );
      return enterprise;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async remove(id: string) {
    
    const deleteResponse = await this.directionRepository.softDelete( id );

    if( !deleteResponse.affected )
      throw new NotFoundException(`Enterprise whit ID:${id} not found`);
  }
}
