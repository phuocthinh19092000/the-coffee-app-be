import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UsersController } from '../modules/users/controllers/users.controller';
import { UsersService } from '../modules/users/services/users.service';
import { OrdersController } from '../modules/orders/controllers/orders.controller';
import { OrdersService } from '../modules/orders/services/orders.service';
import { UsersModule } from '../modules/users/users.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { ProductsController } from '../modules/products/controllers/products.controller';
import { ProductsService } from '../modules/products/services/products.service';
import { ProductsModule } from '../modules/products/products.module';
import { CategoriesController } from '../modules/categories/controllers/categories.controller';
import { CategoriesService } from '../modules/categories/services/categories.service';
import { CategoriesModule } from '../modules/categories/categories.module';
import { AuthService } from '../modules/auth/services/auth.service';
import { AuthModule } from '../modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    // UsersModule,
    // OrdersModule,
    // ProductsModule,
    // CategoriesModule,
    // AuthModule,
    // MongooseModule.forRoot('mongodb://localhost:27017/the-coffee-app-be'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
