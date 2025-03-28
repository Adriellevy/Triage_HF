import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Mi API con NestJS')
    .setDescription('Documentación de la API usando Swagger')
    .setVersion('1.0')
    .addBearerAuth() // Para autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  console.log("Variables de entorno:",environment)
  await app.listen(environment.port);
}
bootstrap();
