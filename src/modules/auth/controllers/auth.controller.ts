import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { LoginDto } from 'src/modules/users/dto/requests/login-dto.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { Jwt } from '../dto/jwt.dto';
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
  @ApiInternalServerErrorResponse({ description: 'logout Failed' })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req, @Res() res) {
    await this.userService.removeDeviceToken(req.user);
    res.status(200).send();
  }
}
