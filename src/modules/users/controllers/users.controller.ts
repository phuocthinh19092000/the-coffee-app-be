import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateWebhookDto } from '../dto/requests/update-webhook.dto';
import { UserInforDto } from '../dto/respone/user-infor.dto';
import { UsersService } from '../services/users.service';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @Get('/profile')
  @ApiOkResponse({ description: 'successfully', type: UserInforDto })
  @ApiUnauthorizedResponse({ description: 'please authenticate' })
  getProfile(@User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Update webhook ' })
  @ApiOkResponse({
    description: 'Update webhook  successfully',
    type: UserInforDto,
  })
  @ApiUnauthorizedResponse({ description: 'please authenticate' })
  @Patch('/webhook')
  updateWebHook(@User() user, @Body() updateWebHookDto: UpdateWebhookDto) {
    return this.usersService.updateWebHook(user, updateWebHookDto.webHook);
  }
}
