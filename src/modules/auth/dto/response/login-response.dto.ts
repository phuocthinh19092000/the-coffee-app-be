import { Role } from 'src/modules/roles/entities/role.entity';

export class LoginResponseDto {
  data: {
    jwtAccessToken: string;
    userInfor: {
      role: Role;
      avatarUrl: string;
      freeUnit: number;
      phoneNumber: number;
      email: string;
      name: string;
    };
  };
}
