import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number;
}
