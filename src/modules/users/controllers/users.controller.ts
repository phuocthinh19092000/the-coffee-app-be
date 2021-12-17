import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserInforDto } from '../dto/respone/user-infor.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Get user profile' })
  @Get('/profile')
  @ApiOkResponse({ description: 'successfully', type: UserInforDto })
  @ApiUnauthorizedResponse({ description: 'please authenticate' })
  getProfile(@User() user) {
    return user;
  }
}
