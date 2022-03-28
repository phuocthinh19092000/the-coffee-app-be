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

  async validateUser(email: string, password: string): Promise<User> {
    const userActive = await this.userService.checkUserActive(email);
    if (userActive && (await bcrypt.compare(password, userActive.password))) {
      return userActive.populate({ path: 'role', select: 'name' });
    }
    return null;
  }

  async login(user: User) {
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, deviceToken, available, ...rest } = userObject;
    const userInfor = {
      ...rest,
      role: rest.role.name,
    };
    return {
      data: {
        jwtAccessToken: this.generateAccessToken(user),
        userInfor,
      },
    };
  }

  private generateAccessToken(user: User) {
    const { name, _id, role } = user;
    const payload = {
      name,
      id: _id,
      role: role.name,
    };

    return this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpiration,
    });
  }
}
