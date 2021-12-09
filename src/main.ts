import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('The Coffee App OTSV')
    .setDescription('The Coffee App OTSV API Documentation')
    .setVersion('3.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
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

  await app.listen(3000);
}
bootstrap();
