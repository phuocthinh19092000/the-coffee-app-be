import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { User as userEntity } from '../entities/user.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FreeUnitService } from 'src/modules/free-unit/services/free-unit.service';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { UpdateWebhookDto } from '../dto/requests/update-webhook.dto';
import { UserInforDto } from '../dto/respone/user-infor.dto';
import { UsersService } from '../services/users.service';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly freeUnitService: FreeUnitService,
  ) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get All User' })
  @Get()
  @ApiOkResponse({
    description: 'Get All User successfully.',
    type: [UserInforDto],
  })
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<{ user: userEntity[]; totalUser: number }> {
    return this.usersService.findAllUser(paginationQueryDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @Get('/profile')
  @ApiOkResponse({ description: 'successfully', type: UserInforDto })
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  getProfile(@User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Get current free unit' })
  @Get('/freeunit')
  @ApiOkResponse({
    description: ' Get current free unit successfully',
    type: Number,
  })
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  getFreeUnit(@User() user) {
    return user.freeUnit;
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update free unit for all users' })
  @Patch('/freeunit')
  @ApiOkResponse({ description: 'Update free unit successfully' })
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  async updateFreeUnit() {
    const freeUnit = await this.freeUnitService.get();
    if (!freeUnit) {
      throw new BadRequestException();
    }
    const newFreeUnit = { freeUnit: freeUnit.quantity };
    return this.usersService.updateAllFreeUnit(newFreeUnit);
  }

  @ApiOperation({ summary: 'Update webhook ' })
  @ApiOkResponse({
    description: 'Update webhook successfully',
    type: UserInforDto,
  })
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  @Patch('/webhook')
  updateWebHook(@User() user, @Body() updateWebHookDto: UpdateWebhookDto) {
    return this.usersService.updateWebHook(user, updateWebHookDto.webHook);
  }
}
