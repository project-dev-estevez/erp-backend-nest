import { Injectable } from '@nestjs/common';
import { DatabaseSeedService } from './services/database-seed/database-seed.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly databaseSeedService: DatabaseSeedService
  ) {}
  
  async runSeeds() {

    await this.databaseSeedService.deleteTables();

    const [
      ceo, generalDirector, directorIngrid, directorBrandon, directorElizabeth, gerente, coordinador
    ] = await this.databaseSeedService.insertUsers();
    const estevezID = await this.databaseSeedService.insertEnterprises(ceo.id);
    const directionID = await this.databaseSeedService.insertDirections(estevezID, generalDirector.id);
    const departmentID = await this.databaseSeedService.insertDepartments(directionID, 10000);
    const areaID = await this.databaseSeedService.insertAreas(departmentID, coordinador.id, 100);
    const employeeID = await this.databaseSeedService.insertEmployees(areaID, 100);
    const customerID = await this.databaseSeedService.insertCustomers(100);
    await this.databaseSeedService.insertProjects(customerID, estevezID, 100);

    return {
      message: 'Seeds executed successfully!',
      ceoID: ceo.id,
    };
  }
}
