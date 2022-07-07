import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/common/config/config.module';
import { FileStoragesModule } from '../file-storage/file-storage.module';
import { FreeUnitModule } from '../free-unit/free-unit.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './controllers/users.controller';
import UserSchema, { User } from './entities/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    RolesModule,
    FreeUnitModule,
    AppConfigModule,
    FileStoragesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
