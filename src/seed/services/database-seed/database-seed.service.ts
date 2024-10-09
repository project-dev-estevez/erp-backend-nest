import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/areas/entities/area.entity';
import { User } from 'src/auth/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Direction } from 'src/directions/entities/direction.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Enterprise } from 'src/enterprises/entities/enterprise.entity';
import { Project } from 'src/projects/entities/project.entity';
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
      private readonly departmentRepository: Repository<Department>,
      @InjectRepository( Area )
      private readonly areaRepository: Repository<Area>,
      @InjectRepository( Employee )
      private readonly employeeRepository: Repository<Employee>,
      @InjectRepository( Customer )
      private readonly customerRepository: Repository<Customer>,
      @InjectRepository( Project )
      private readonly projectRepository: Repository<Project>,
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
      const randomName = faker.commerce.department() // Genera un nombre aleatorio para el departamento

      departments.push( this.departmentRepository.create(
        { name: randomName, direction: { id: directionID } }
      ));
    }

    await this.departmentRepository.save(departments);

    return departments[0].id;
  }
  async insertAreas(departmentID: string, coordinator: string, quantity: number = 10){
    const areas: Area[] = [];

    for (let i = 0; i < quantity; i++) {
      const randomName = faker.person.jobArea() // Genera un nombre aleatorio para el área

      areas.push(this.areaRepository.create(
        { name: randomName, coordinator: { id: coordinator }, department: { id: departmentID } }
      ));
    }

    await this.areaRepository.save(areas);

    return areas[0].id;

  }

  async insertEmployees(areaID: string, quantity: number = 10){
    const employees: Employee[] = [];

    for (let i = 0; i < quantity; i++) {
      const randomName = faker.person.jobArea() // Genera un nombre aleatorio para el empleado
      const randomPosition = faker.person.jobTitle() // Genera una posición aleatoria para el empleado

      employees.push(this.employeeRepository.create(
        { name: randomName, position: randomPosition, area: { id: areaID } }
      ));
    }

    await this.employeeRepository.save(employees);

    return employees[0].id;
  
  }

  async insertCustomers(quantity: number = 10) {
    const customers: Customer[] = [];

    for (let i = 0; i < quantity; i++) {
      const randomName = faker.company.name() // Genera un nombre aleatorio para el cliente
      const randomRFC = faker.commerce.isbn(13) // Genera un RFC aleatorio para el cliente
      const randomEmail = faker.internet.email(); // Genera un email aleatorio para el cliente
      const randomPhoneNumber = faker.phone.number() // Genera un número de teléfono aleatorio para el cliente

      customers.push(this.customerRepository.create(
        { name: randomName, rfc: randomRFC, email: randomEmail, phoneNumber: randomPhoneNumber }
      ));
    }

    await this.customerRepository.save(customers);

    return customers[0].id;
  }

  async insertProjects(customerID: string, enterpriseID: string, quantity: number = 10) {
    const projects: Project[] = [];

    for (let i = 0; i < quantity; i++) {
      const randomName = faker.company.catchPhrase() // Genera un nombre aleatorio para el proyecto
      projects.push(this.projectRepository.create(
        { name: randomName, customer: { id: customerID }, enterprise: { id: enterpriseID } }
      ));
    }
    await this.projectRepository.save(projects);
    
    return projects[0].id;
  }

}
