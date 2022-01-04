import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsString } from 'class-validator';
import { IsSpecificTypeArray } from 'src/decorators/custom-validation-decorators/validation.pipe';
export class PushNotificationDto {
  @ApiProperty()
  @ArrayUnique()
  @IsSpecificTypeArray('string')
  deviceToken: string[];

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;
}
