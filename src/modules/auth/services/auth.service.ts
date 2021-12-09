import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/common/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private appConfigService: AppConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const { name, email, _id } = user;
    const payload = {
      name,
      email,
      sub: _id.toString(),
      role: 'employee',
    };
    return { jwtAccessToken: this.generateAccessToken(payload) };
  }

  private generateAccessToken(payload: Record<string, any>) {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpiration,
    });
  }
}
