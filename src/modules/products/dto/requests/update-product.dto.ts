import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends OmitType(CreateProductDto, [
  'images',
] as const) {
  @IsOptional()
  @ApiHideProperty()
  images: string;

  @IsOptional()
  @ApiHideProperty()
  status: string;
}
