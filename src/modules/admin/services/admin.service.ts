import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/modules/users/dto/requests/update-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  updateUser(id: string, updateUserDto: UpdateUserDto, roleId: string) {
    updateUserDto.role = roleId;
    return this.usersService.updateUser(id, updateUserDto);
  }
}
