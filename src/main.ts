import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  const logger = new Logger('Main');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  const config = new DocumentBuilder()
                  .setTitle('Estevez.Jor ERP API')
                  .setDescription('Con ❤️ para Estevez.Jor')
                  .setVersion('1.0')
                  .addBearerAuth()
                  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.log(`Application is running on port: ${port}`);
}

main();