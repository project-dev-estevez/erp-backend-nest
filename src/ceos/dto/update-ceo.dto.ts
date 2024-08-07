import { PartialType } from '@nestjs/swagger';
import { CreateCeoDto } from './create-ceo.dto';

export class UpdateCeoDto extends PartialType(CreateCeoDto) {}
