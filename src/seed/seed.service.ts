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
      ceo, generalDirector, directorIngrid, directorBrandon, directorElizabeth
    ] = await this.databaseSeedService.insertUsers();
    const estevezID = await this.databaseSeedService.insertEnterprises(ceo.id);
    const directionID = await this.databaseSeedService.insertDirections(estevezID, generalDirector.id);
    await this.databaseSeedService.insertDepartments(directionID, 10000);    

    return {
      message: 'Seeds executed successfully!',
      ceoID: ceo.id,
    };
  }
}
