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
    private readonly enterpriseRepository: Repository<Enterprise>
  ) {}

  async create(createEnterpriseDto: CreateEnterpriseDto) {

    const { name, ceoId, address, phoneNumber, rfc } = createEnterpriseDto;

    try{

      const enterprise = this.enterpriseRepository.create({
        name,
        ceo: { id: ceoId },
        address,
        phoneNumber,
        rfc
      });

      await this.enterpriseRepository.save( enterprise );
      return enterprise;
    }catch (error) {
      return handleDBErrors(error, this.logger);
    }
    
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const [results, total] = await this.enterpriseRepository.findAndCount({
      relations: ['ceo'],
      take: limit,
      skip: offset
    });
    return { results, total };

  }

  async findOne(id: string) {
    
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id },
      relations: ['ceo']
    });

    if(!enterprise)
      throw new NotFoundException(`Enterprise with ID:${id} not found`);

    try{
      await this.enterpriseRepository.save( enterprise );
      return enterprise;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async update(id: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    
    const enterprise = await this.enterpriseRepository.preload({
      id,
      ...updateEnterpriseDto
    });

    if( !enterprise )
      throw new NotFoundException(`Enterprise with ID:${id} not found`);

    try {
      await this.enterpriseRepository.save( enterprise );
      return enterprise;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async remove(id: string) {
    
    const deleteResponse = await this.enterpriseRepository.softDelete( id );

    if( !deleteResponse.affected )
      throw new NotFoundException(`Enterprise whit ID:${id} not found`);
  }
}
