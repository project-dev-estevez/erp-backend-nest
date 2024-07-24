import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ManagersController],
  providers: [ManagersService],
  imports: [AuthModule]
})
export class ManagersModule {}
