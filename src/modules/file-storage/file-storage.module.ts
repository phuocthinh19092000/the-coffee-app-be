import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { FileStoragesService } from './services/file-storage.sevice';

@Module({
  imports: [AppConfigModule],
  providers: [FileStoragesService],
  exports: [FileStoragesService],
})
export class FileStoragesModule {}
