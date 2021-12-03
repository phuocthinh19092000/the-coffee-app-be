import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/requests/create-product.dto';
@Controller('products')
export class ProductsController {}
