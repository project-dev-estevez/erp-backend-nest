import { Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Enterprise } from './entities/enterprise.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EnterprisesService {

  constructor(
    @InjectRepository(Enterprise)
    private readonly directionRepository: Repository<Enterprise>
  ) {}

  create(createEnterpriseDto: CreateEnterpriseDto) {
    return 'This action adds a new enterprise';
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const [results, total] = await this.directionRepository.findAndCount({
      where: { state: true },
      relations: ['ceo'],
      take: limit,
      skip: offset
    });
    return { results, total };

  }

  findOne(id: number) {
    return `This action returns a #${id} enterprise`;
  }

  update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    return `This action updates a #${id} enterprise`;
  }

  remove(id: number) {
    return `This action removes a #${id} enterprise`;
  }
}
