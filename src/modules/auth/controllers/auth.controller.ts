import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { LoginDto } from 'src/modules/users/dto/requests/login-dto.dto';
import { Jwt } from '../dto/jwt.dto';
import { AuthService } from '../services/auth.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login' })
  @ApiUnauthorizedResponse({ description: 'Please authenticate' })
  @ApiOkResponse({ description: 'login successfully', type: Jwt })
  @Post('/login')
  async login(@Req() req, @Res() res) {
    const user = req.user;
    const jwt = await this.authService.login(user);
    res.status(200).send(jwt);
  }
}
