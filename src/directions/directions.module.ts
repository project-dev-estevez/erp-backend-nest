import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomGeneralDirectionvalidation } from './decorators/is-unique-general-direction.decorator';

@Module({
  controllers: [DirectionsController],
  providers: [DirectionsService, CustomGeneralDirectionvalidation],
  imports: [
    TypeOrmModule.forFeature([ Direction ]),
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class DirectionsModule {}
