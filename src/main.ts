import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import { AppConfigService } from 'src/common/config/config.service';
import { getMessaging, getToken } from 'firebase/messaging';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);

  const configSwaggerDocument = new DocumentBuilder()
    .setTitle('The Coffee App OTSV')
    .setDescription('The Coffee App OTSV API Documentation')
    .setVersion('3.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwaggerDocument);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: { target: false },
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const serviceFirebase: ServiceAccount = {
    projectId: appConfigService.projectId,
    privateKey: appConfigService.privateKey,
    clientEmail: appConfigService.clientEmail,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceFirebase),
    databaseURL: appConfigService.firebaseUrl,
  });

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
