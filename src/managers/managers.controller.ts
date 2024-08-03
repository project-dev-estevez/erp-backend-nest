import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR, ValidRoles.DIRECTOR )
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.managersService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR, ValidRoles.DIRECTOR )
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
    return this.managersService.update(id, updateManagerDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.CEO, ValidRoles.GENERAL_DIRECTOR, ValidRoles.DIRECTOR )
  remove(@Param('id') id: string) {
    return this.managersService.remove(id);
  }
}
