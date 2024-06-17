import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository( User ) 
    private readonly userRepository: Repository<User>,
  ) {}
  
  async runSeeds() {

    await this.deleteTables();
    await this.insertUsers();

    return {
      message: 'Seeds executed successfully!'
    };
  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( seedUser => {
      users.push( this.userRepository.create( seedUser ) );
    })

    await this.userRepository.save( users );
  }

  private async deleteTables() {

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete()
                      .where({})
                      .execute();
  }
}
