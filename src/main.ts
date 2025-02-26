import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS - permitir acesso de qualquer origem
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Timeline API')
    .setDescription('API para gerenciamento de timelines de projetos')
    .setVersion('1.0')
    .addTag('Timelines')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configuração do Scalar para uma documentação mais bonita
  app.use(
    '/api-docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    }),
  );
  
  // Rota padrão do Swagger (opcional, já que estamos usando o Scalar)
  SwaggerModule.setup('swagger', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicação rodando em: http://localhost:${port}`);
  console.log(`Documentação Scalar disponível em: http://localhost:${port}/api-docs`);
  console.log(`Documentação Swagger disponível em: http://localhost:${port}/swagger`);
}
bootstrap(); 