import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Direction } from 'src/directions/entities/direction.entity';
import { Enterprise } from 'src/enterprises/entities/enterprise.entity';
import { initialData } from 'src/seed/data/seed-data';
import { Connection, DataSource, Repository } from 'typeorm';

@Injectable()
export class DatabaseSeedService {

  constructor(
      private readonly dataSource: DataSource,
      @InjectRepository( User ) 
      private readonly userRepository: Repository<User>,
      @InjectRepository( Enterprise )
      private readonly enterpriseRepository: Repository<Enterprise>,
      @InjectRepository( Direction )
      private readonly directionRepository: Repository<Direction>,
      @InjectRepository( Department )
      private readonly departmentRepository: Repository<Department>
  ){}


  async deleteTables() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
        await queryRunner.startTransaction();

        // Eliminar todas las tablas
        await queryRunner.query(`
            DO $$ DECLARE
            r RECORD;
            BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
            END $$;
        `);

        await queryRunner.commitTransaction();
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
        await this.dataSource.synchronize(true);
    }
  }

  async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( seedUser => {
      users.push( this.userRepository.create( seedUser ) );
    })

    await this.userRepository.save( users );

    return users;
  }

  async insertEnterprises(ceoID: string) {

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
    return enterprises[0].id;
  }

  async insertDirections(enterpriseID: string, generalDirectorID: string) {

    let seedDirections = initialData.directions;

    seedDirections = seedDirections.map( seedDirection => {
      return {
        ...seedDirection,
        enterprise: { id: enterpriseID },
        director: { id: generalDirectorID }
      }
    });

    const directions: Direction[] = [];

    seedDirections.forEach( seedDirection => {
      directions.push( this.directionRepository.create( seedDirection ) );
    });

    await this.directionRepository.save( directions );

    return directions[0].id;
  }

  async insertDepartments(directionID: string, quantity: number = 10) {
    const directions = await this.directionRepository.find();

    const departments: Department[] = [];

    for (let i = 0; i < quantity; i++) {
      const randomName = faker.internet.userName(); // Genera un nombre aleatorio para el departamento

      departments.push( this.departmentRepository.create(
        { name: randomName, direction: { id: directionID } }
      ));
    }

    await this.departmentRepository.save(departments);
  }

}
