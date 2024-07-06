import { Module } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { EnterprisesController } from './enterprises.controller';
import { Enterprise } from './entities/enterprise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  imports: [
    TypeOrmModule.forFeature([ Enterprise ]),
    AuthModule
  ],
  exports: [TypeOrmModule]
})
export class EnterprisesModule {}
