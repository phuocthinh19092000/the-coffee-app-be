import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from 'src/modules/users/dto/requests/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
@ApiTags('admin/account')
@Controller('admin/account')
export class AdminController {
  constructor(private readonly userService: UsersService) {}
  @ApiOperation({ summary: 'Create new account' })
  @ApiCreatedResponse({
    description: 'create new account successfully',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'username already existed' })
  @Post()
  async createAccount(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findUserByUserName(
      createUserDto.username,
    );

    if (user) {
      throw new BadRequestException('username already existed');
    }

    return this.userService.createUser(createUserDto);
  }
}
