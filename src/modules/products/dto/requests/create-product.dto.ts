import { IsNumber, IsOptional, Min, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  description: string;

  @IsOptional()
  avatarUrl: string;
}
