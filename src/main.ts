import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  const config = new DocumentBuilder()
  .setTitle('API')
  .setDescription('CapsuleCare API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Api', app, document)

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
