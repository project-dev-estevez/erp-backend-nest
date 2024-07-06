import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from './directors.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DirectorsController],
  providers: [DirectorsService],
  imports: [ AuthModule ]
})
export class DirectorsModule {}
