import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // DATABASE
  databaseUrl: string = this.configService.get<string>('MONGO_URL');

  // JWT
  jwtAccessSecret: string = this.configService.get('JWT_ACCESS_SECRET');
  jwtRefreshSecret: string = this.configService.get('JWT_REFRESH_SECRET');
  jwtAccessExpiration: number = this.configService.get('JWT_ACCESS_EXPIRATION');
  jwtRefreshExpiration: number = this.configService.get(
    'JWT_REFRESH_EXPIRATION',
  );
}
