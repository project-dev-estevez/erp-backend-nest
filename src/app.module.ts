import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiValidationSchema } from './config/joi.validation';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { DirectionsModule } from './directions/directions.module';
import { EnterprisesModule } from './enterprises/enterprises.module';
import { DirectorsModule } from './directors/directors.module';
import { DepartmentsModule } from './departments/departments.module';
import { ManagersModule } from './managers/managers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,     
      autoLoadEntities: true,
      synchronize: true, 
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: true,
    }),

    SeedModule,
    AuthModule,
    CommonModule,
    DirectionsModule,
    EnterprisesModule,
    DirectorsModule,
    DepartmentsModule,
    ManagersModule,
  ]
})
export class AppModule {}
