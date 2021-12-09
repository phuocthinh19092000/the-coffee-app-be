import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
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
  @ApiCreatedResponse({
    type: Jwt,
    description: ' login successfully ',
  })
  @ApiUnauthorizedResponse({ description: 'Please authenticate' })
  @Post('/login')
  async login(@Req() req) {
    const user = req.user;
    return await this.authService.login(user);
  }
}
