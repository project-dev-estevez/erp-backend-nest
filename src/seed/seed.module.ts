import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EnterprisesModule } from 'src/enterprises/enterprises.module';
import { DirectionsModule } from 'src/directions/directions.module';
import { DatabaseSeedService } from './services/database-seed/database-seed.service';
import { DepartmentsModule } from 'src/departments/departments.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService, DatabaseSeedService],
  imports: [ AuthModule, EnterprisesModule, DirectionsModule, DepartmentsModule ],
})
export class SeedModule {}
