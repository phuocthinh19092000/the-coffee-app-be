import { payload } from './../interface/payload-jwt.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/common/config/config.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserStatus } from 'src/modules/users/constants/user.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    appConfigService: AppConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtAccessSecret,
    });
  }

  async validate(payload: payload) {
    const user = await this.userService.findUserById(payload.id);
    if (user && user.available === UserStatus.ACTIVE) {
      return user;
    }
    return null;
  }
}
