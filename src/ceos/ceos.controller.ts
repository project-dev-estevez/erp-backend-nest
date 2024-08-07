import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CeosService } from './ceos.service';
import { CreateCeoDto } from './dto/create-ceo.dto';
import { UpdateCeoDto } from './dto/update-ceo.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('CEOS')
@Controller('ceos')
export class CeosController {
  constructor(private readonly ceosService: CeosService) {}

  @Post()
  create(@Body() createCeoDto: CreateCeoDto) {
    return this.ceosService.create(createCeoDto);
  }

  @Get()
  @Auth( ValidRoles.CEO )
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.ceosService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth( ValidRoles.CEO )
  findOne(@Param('id') id: string) {
    return this.ceosService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.CEO )
  update(@Param('id') id: string, @Body() updateCeoDto: UpdateCeoDto) {
    return this.ceosService.update(id, updateCeoDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.CEO )
  remove(@Param('id') id: string) {
    return this.ceosService.remove(id);
  }
}
