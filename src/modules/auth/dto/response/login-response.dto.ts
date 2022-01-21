export class LoginResponseDto {
  data: {
    jwtAccessToken: string;
    userInfor: {
      role: string;
      avatarUrl: string;
      freeUnit: number;
      phoneNumber: number;
      email: string;
      name: string;
    };
  };
}
