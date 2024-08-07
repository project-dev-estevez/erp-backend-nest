import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import { Enterprise } from '../enterprises/entities/enterprise.entity';
import { Direction } from 'src/directions/entities/direction.entity';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository( User ) 
    private readonly userRepository: Repository<User>,
    @InjectRepository( Enterprise )
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository( Direction )
    private readonly directionRepository: Repository<Direction>
  ) {}
  
  async runSeeds() {

    await this.deleteTables();
    const ceoID = await this.insertUsers();
    await this.insertEnterprises(ceoID);

    return {
      message: 'Seeds executed successfully!',
      ceoID
    };
  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( seedUser => {
      users.push( this.userRepository.create( seedUser ) );
    })

    await this.userRepository.save( users );

    const ceoID = users.find(user => user.roles.includes('ceo')).id;
    return ceoID;
  }

  private async insertEnterprises(ceoID: string) {

    let seedEnterprises = initialData.enterprises;

    seedEnterprises = seedEnterprises.map( seedEnterprise => {
      return {
        ...seedEnterprise,
        ceo: { id: ceoID }
      }
    });

    const enterprises: Enterprise[] = [];

    seedEnterprises.forEach( seedEnterprise => {
      enterprises.push( this.enterpriseRepository.create( seedEnterprise ) );
    });

    await this.enterpriseRepository.save( enterprises );
  }

  private async deleteTables() {

    const queryBuilderDirections = this.directionRepository.createQueryBuilder();
    await queryBuilderDirections.delete()
                                .where({})
                                .execute();

    const queryBuilderEnterprise = this.enterpriseRepository.createQueryBuilder();
    await queryBuilderEnterprise.delete()
                                .where({})
                                .execute();

    const queryBuilderUsers = this.userRepository.createQueryBuilder();
    await queryBuilderUsers.delete()
                           .where({})
                           .execute();
  }
}
