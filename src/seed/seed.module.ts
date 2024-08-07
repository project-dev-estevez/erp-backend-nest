import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EnterprisesModule } from 'src/enterprises/enterprises.module';
import { DirectionsModule } from 'src/directions/directions.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ AuthModule, EnterprisesModule, DirectionsModule ],
})
export class SeedModule {}
