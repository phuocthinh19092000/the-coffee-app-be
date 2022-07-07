import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  price: number;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  images: string;

  @IsString()
  @ApiProperty({ description: 'Category Id Of Product' })
  category: string;
}
