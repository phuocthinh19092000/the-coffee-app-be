import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  @Get('/profile')
  getProfile(@User() user) {
    const { password, ...restUser } = user._doc;
    return restUser;
  }
}
