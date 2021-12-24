import { payload } from './../interface/payload-jwt.interface';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/common/config/config.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private appConfigService: AppConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findUserByUserName(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const { name, email, _id } = user;
    const payload = {
      name,
      email,
      id: _id,
      role: 'employee',
    };
    return { jwtAccessToken: this.generateAccessToken(payload) };
  }

  private generateAccessToken(payload: payload) {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpiration,
    });
  }
}
