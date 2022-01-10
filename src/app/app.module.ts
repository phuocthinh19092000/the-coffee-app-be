import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ProductsModule } from '../modules/products/products.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AppConfigService } from 'src/common/config/config.service';
import { AppConfigModule } from 'src/common/config/config.module';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { NotificationsModule } from 'src/modules/notification/notifications.module';
import { StatusModule } from 'src/modules/status/status.module';
import { RolesModule } from 'src/modules/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.databaseUrl,
        useNewUrlParser: true,
      }),
      inject: [AppConfigService],
    }),
    NotificationsModule,
    AppConfigModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    RolesModule,
    AdminModule,
    UsersModule,
    CategoriesModule,
    AuthModule,
    StatusModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
