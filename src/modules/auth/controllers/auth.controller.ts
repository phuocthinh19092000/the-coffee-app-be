import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { LoginDto } from 'src/modules/auth/dto/login.dto';

import { UsersService } from 'src/modules/users/services/users.service';
import { Jwt } from '../dto/jwt.dto';
import { LogoutDto } from '../dto/logout.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login' })
  @ApiUnauthorizedResponse({ description: 'Please authenticate' })
  @ApiOkResponse({ description: 'login successfully', type: Jwt })
  @Post('/login')
  async login(@Req() req, @Res() res) {
    if (req.body.deviceToken) {
      await this.userService.updateDeviceToken(req.user, req.body.deviceToken);
    }
    const jwt = await this.authService.login(req.user);
    res.status(200).send(jwt);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'logout successfully' })
  @ApiBody({ type: LogoutDto })
  @ApiInternalServerErrorResponse({ description: 'logout Failed' })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Body() logout: LogoutDto, @User() user, @Res() res) {
    await this.userService.removeDeviceToken(user, logout.deviceToken);
    res.status(200).send();
  }
}
