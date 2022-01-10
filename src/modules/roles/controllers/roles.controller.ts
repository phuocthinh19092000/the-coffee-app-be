import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';
import { RolesService } from '../services/roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ApiOperation({ summary: 'Create new role' })
  @ApiCreatedResponse({
    description: 'create new role successfully',
    type: Role,
  })
  @ApiBadRequestResponse({ description: 'role already existed' })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const roles = await this.rolesService.findByName(createRoleDto.name);
    if (roles) {
      throw new BadRequestException({ description: 'Role already existed' });
    }
    return this.rolesService.create(createRoleDto);
  }
}
