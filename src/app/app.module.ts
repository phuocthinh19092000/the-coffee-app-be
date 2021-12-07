import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ProductsModule } from '../modules/products/products.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/the-coffee-app-be'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
