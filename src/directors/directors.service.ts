import { Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectorsService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}


  create(createDirectorDto: CreateDirectorDto) {
    return 'This action adds a new director';
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Utiliza la operación de contención de array de PostgreSQL para filtrar usuarios con el rol "director"
    queryBuilder
      .where(':role = ANY(user.roles)', { role: 'director' }) // Filtra usuarios que tienen el rol 'director'
      .andWhere('user.state = :state', { state: true }) // Asume que quieres seguir filtrando por el estado del usuario
      .take(limit)
      .skip(offset);

    const [results, total] = await queryBuilder.getManyAndCount();

    return { results, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} director`;
  }

  update(id: number, updateDirectorDto: UpdateDirectorDto) {
    return `This action updates a #${id} director`;
  }

  remove(id: number) {
    return `This action removes a #${id} director`;
  }
}
