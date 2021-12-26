import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  Logger.log(`Listening on http://localhost:${process.env.PORT}`);
}
bootstrap();
