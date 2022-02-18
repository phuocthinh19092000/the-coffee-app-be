import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';
import { AppConfigService } from 'src/common/config/config.service';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FileStoragesService {
  constructor(private readonly appConfigService: AppConfigService) {
    const serviceFirebase: ServiceAccount = {
      projectId: appConfigService.projectId,
      privateKey: appConfigService.privateKey,
      clientEmail: appConfigService.clientEmail,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceFirebase),
      databaseURL: appConfigService.firebaseUrl,
      storageBucket: appConfigService.storageBucket,
    });
  }

  async storeFile(file: Express.Multer.File) {
    try {
      const newFile = admin.storage().bucket().file(file.originalname);
      await newFile.save(file.buffer, {
        contentType: file.mimetype,
        gzip: true,
      });
      const token = uuidv4();
      await newFile.setMetadata({
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      });

      return this.createPersistentDownloadUrl(
        newFile.bucket.name,
        newFile.name,
        token,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  createPersistentDownloadUrl = (
    bucket: string,
    pathToFile: string,
    downloadToken: string,
  ) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      pathToFile,
    )}?alt=media&token=${downloadToken}`;
  };
}
