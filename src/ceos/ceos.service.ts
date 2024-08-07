import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCeoDto } from './dto/create-ceo.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { JwtPayload, ValidRoles } from 'src/auth/interfaces';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';

import * as bcrypt from 'bcrypt';
@Injectable()
export class CeosService {

  private logger: Logger = new Logger('CeosService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, 
  ) {}

  async create(createCeoDto: CreateCeoDto) {
    
    const { password, ...userdata } = createCeoDto;

    try {
      
      const ceo = this.userRepository.create({
        ...userdata,
        password: bcrypt.hashSync( password, 10 ),
        roles: [ValidRoles.CEO]
      });

      await this.userRepository.save( ceo );
      delete ceo.password;

      return {
        ...ceo,
        token: this.getJwtToken({ id:ceo.id })
      }
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
    .where(':role = ANY(user.roles)', { role: 'ceo' })
    .andWhere('user.state = :state', { state: true })
    .take(limit)
    .skip(offset)

    const [results, total] = await queryBuilder.getManyAndCount();

    return { results, total };

  }

  async findOne(id: string) {
    
    const ceo = await this.userRepository.findOne({
      where: {
        id,
        roles: Any[ValidRoles.CEO]
      }
    })

    if(!ceo)
      throw new NotFoundException(`Ceo with ID:${id} not found`);

    try {
      await this.userRepository.save(ceo);
      return ceo;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }

  }

  async update(id: string, updateCeoDto: UpdateCeoDto) {
    
    const ceo = await this.userRepository.preload({
      id,
      ...updateCeoDto
    });

    if(!ceo)
      throw new NotFoundException(`Ceo with ID:${id} not found`);

    try {
      await this.userRepository.save(ceo);
      return ceo;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async remove(id: string) {
    
    const deleteResponse = await this.userRepository.softDelete(id);

    if(!deleteResponse.affected)
      throw new NotFoundException(`Ceo with ID:${id} not found`)
  }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }
}
