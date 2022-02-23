import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';
import { AppConfigService } from 'src/common/config/config.service';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { RegexDownloadURL } from '../constants/regex.constant';
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
      const token = uuidv4();
      const newFile = admin.storage().bucket().file(token);
      await newFile.save(file.buffer, {
        contentType: file.mimetype,
        gzip: true,
      });

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

  getFileName = (downloadURL: string) => {
    if (RegexDownloadURL.test(downloadURL)) {
      const uuidv4Length = (uuidv4() as string).length;
      return downloadURL.slice(-uuidv4Length);
    }
    return '';
  };

  deleteAllFiles = () => {
    try {
      admin.storage().bucket().deleteFiles();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  };
  deleteFile = (name: string) => {
    try {
      admin.storage().bucket().file(name).delete();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  };
}
