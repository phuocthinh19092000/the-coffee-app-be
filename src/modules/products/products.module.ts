import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product, ProductSchema } from './entities/product.entity';

import { CategoriesService } from '../categories/services/categories.service';

import {
  Category,
  CategorySchema,
} from '../categories/entities/category.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService],
})
export class ProductsModule {}
