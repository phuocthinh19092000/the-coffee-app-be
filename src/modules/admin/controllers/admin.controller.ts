import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { RolesService } from 'src/modules/roles/services/roles.service';

import { CreateUserDto } from 'src/modules/users/dto/requests/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';

@UseGuards(JwtAuthGuard)
@ApiTags('admin/account')
@Controller('admin/account')
export class AdminController {
  constructor(
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create new account' })
  @ApiCreatedResponse({
    description: 'create new account successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Email already existed' })
  @Post()
  async createAccount(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findUserByEmail(createUserDto.email);

    if (user) {
      throw new BadRequestException('Email already existed');
    }

    const role = await this.rolesService.findByName(createUserDto.role);

    if (!role) {
      throw new BadRequestException('Role is not existed');
    }

    return this.userService.createUser(createUserDto, role._id);
  }
}
