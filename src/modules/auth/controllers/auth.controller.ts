import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { LogoutDto } from '../dto/logout.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { LoginResponseDto } from '../dto/response/login-response.dto';
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
  @ApiUnauthorizedResponse({ description: 'Please Authenticate' })
  @ApiOkResponse({ description: 'login successfully', type: LoginResponseDto })
  @Post('/login')
  async login(@Req() req, @Res() res) {
    const jwt = await this.authService.login(req.user);
    res.status(200).send(jwt);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Logout Successfully' })
  @ApiBody({ type: LogoutDto })
  @ApiInternalServerErrorResponse({ description: 'Logout Failed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@Body() logout: LogoutDto, @User() user, @Res() res) {
    if (logout.deviceToken) {
      await this.userService.removeDeviceToken(user, logout.deviceToken);
    }
    res.status(200).send();
  }
}
