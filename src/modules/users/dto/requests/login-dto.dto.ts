import { IsString, MaxLength, MinLength } from 'class-validator';
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
