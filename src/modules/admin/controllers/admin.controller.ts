import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { RolesService } from 'src/modules/roles/services/roles.service';
import { CreateUserDto } from 'src/modules/users/dto/requests/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/requests/update-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { AdminService } from '../services/admin.service';
@Roles(RoleType.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('admin/account')
@Controller('admin/account')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

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

  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update account' })
  @ApiOkResponse({
    description: 'update account successfully',
    type: User,
  })
  @Patch(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new BadRequestException({
        description: 'User does not exist',
        status: 400,
      });
    }

    const currentUserEmail = user.email;
    const existedUser = await this.userService.findUserByEmail(
      updateUserDto.email,
    );

    if (currentUserEmail !== updateUserDto.email && existedUser) {
      throw new BadRequestException({
        description: 'Email already exists',
        status: 400,
      });
    }
    const role = await this.rolesService.findByName(updateUserDto.role);

    if (!role) {
      throw new BadRequestException('Role is not existed');
    }

    try {
      return this.adminService.updateUser(id, updateUserDto, role._id);
    } catch (e) {
      Logger.error(e);
    }
  }
}
