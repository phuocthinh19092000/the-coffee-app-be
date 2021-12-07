import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/requests/create-product.dto';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get All Products successfully.',
    type: Product,
  })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create Product successfully.',
    type: Product,
  })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }
}
