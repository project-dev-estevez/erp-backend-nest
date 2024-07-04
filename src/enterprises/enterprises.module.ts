import { Module } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { EnterprisesController } from './enterprises.controller';
import { Enterprise } from './entities/enterprise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  imports: [
    TypeOrmModule.forFeature([ Enterprise ]),
  ],
  exports: [TypeOrmModule]
})
export class EnterprisesModule {}
