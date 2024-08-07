import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { CeosService } from './ceos.service';
import { CeosController } from './ceos.controller';

@Module({
  controllers: [CeosController],
  providers: [CeosService],
  imports: [AuthModule]
})
export class CeosModule {}
