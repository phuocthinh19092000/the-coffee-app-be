import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from 'src/modules/users/dto/requests/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { AdminService } from '../services/admin.service';

@Controller('admin/account')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

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
