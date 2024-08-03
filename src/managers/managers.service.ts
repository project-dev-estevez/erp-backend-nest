import { Manager } from './entities/manager.entity';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { handleDBErrors } from 'src/common/helpers/db-error-handler.helper';
import { ValidRoles } from 'src/auth/interfaces';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ManagersService {

  private logger: Logger = new Logger('ManagersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    const { password, ...userData } = createManagerDto;

    try {

      const manager = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ),
        roles: [ValidRoles.MANAGER]
      });

      await this.userRepository.save( manager );
      delete manager.password;

      return {
        ...manager,
        token: this.getJwtToken({ id:manager.id })
      }
      
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
    .where(':role = ANY(user.roles)', { role: 'manager' })
    .andWhere('user.state = :state', { state: true })
    .take(limit)
    .skip(offset);

    const [results, total] = await queryBuilder.getManyAndCount();

    return { results, total };
  }

  async findOne(id: string) {
    
    const manager = await this.userRepository.findOne({
      where: {
        id,
        roles: Any[ValidRoles.MANAGER],
      }
    })

    if(!manager)
      throw new NotFoundException(`Manager with ID:${id} not found`);

    try{
      await this.userRepository.save(manager);
      return manager;
    } catch (error){
      return handleDBErrors(error, this.logger);
    }
    
  }

  async update(id: string, updateManagerDto: UpdateManagerDto) {
    
    const manager = await this.userRepository.preload({
      id,
      ...updateManagerDto
    });

    if( !manager )
      throw new NotFoundException(`Manager with ID:${id} not found`);

    try {
      await this.userRepository.save( manager );
      return manager;
    } catch (error) {
      return handleDBErrors(error, this.logger);
    }
  }

  async remove(id: string) {
    const deleteResponse = await this.userRepository.softDelete( id );

    if( !deleteResponse.affected )
      throw new NotFoundException(`Manager with ID:${id} not found`);
  }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }
}
