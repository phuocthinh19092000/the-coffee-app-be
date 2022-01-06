import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [UsersModule, RolesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
