import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * BOOTSTRAP FUNCTION
 * 
 * Initializes the NestJS application with Prisma ORM
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for development
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`
  🚀 Application is running on: http://localhost:${port}
  📚 Learning Prisma ORM with NestJS
  
  Available endpoints:
  - GET    http://localhost:${port}/          (Health check)
  - GET    http://localhost:${port}/users
  - POST   http://localhost:${port}/users
  - GET    http://localhost:${port}/posts
  - POST   http://localhost:${port}/posts
  - GET    http://localhost:${port}/categories
  - POST   http://localhost:${port}/categories
  - GET    http://localhost:${port}/comments
  - POST   http://localhost:${port}/comments
  `);
}
bootstrap();
