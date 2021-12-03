import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../products/entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/requests/create-product.dto';
@Injectable()
export class ProductsService {}
