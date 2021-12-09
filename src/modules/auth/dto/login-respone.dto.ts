export class LoginResponeDto {
  data: {
    jwtAccessToken: string;
    user: {
      username: string;

      name: string;

      email: string;

      phoneNumber: string;

      avatarUrl: string;

      freeUnit: number;
    };
  };
}
