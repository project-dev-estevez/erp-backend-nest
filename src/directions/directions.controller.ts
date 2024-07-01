import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Directions')
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR )
  create(@Body() createDirectionDto: CreateDirectionDto) {
    return this.directionsService.create(createDirectionDto);
  }

  @Get()
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR )
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':id')
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR )
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.directionsService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDirectionDto: UpdateDirectionDto) {
    return this.directionsService.update( id, updateDirectionDto );
  }

  @Delete(':id')
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.directionsService.remove( id );
  }
}
