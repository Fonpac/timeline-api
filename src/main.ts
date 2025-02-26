import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AuthGuard } from './auth/auth.guard'
import { LoggingService } from './logging/logging.service'
import { GlobalExceptionFilter } from './logging/global-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // Disable the default logger
        logger: false,
    })

    // Get the custom logger from the app context
    const logger = app.get(LoggingService)
    // Set the custom logger as the application logger
    app.useLogger(logger)

    // Register the global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter(logger))

    // Log application startup
    logger.log('Application starting up', 'Bootstrap')

    // Configuração do CORS - permitir acesso de qualquer origem
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    })

    app.useGlobalPipes(new ValidationPipe())

    // Get the AuthGuard from the app context
    const authGuard = app.get(AuthGuard)
    app.useGlobalGuards(authGuard)

    // Configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('Timeline API')
        .setDescription('API para gerenciamento de timelines de projetos')
        .setVersion('1.0')
        .addTag('Timelines')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth'
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)

    // Configuração do Scalar para uma documentação mais bonita
    app.use(
        '/api-docs',
        apiReference({
            spec: {
                content: document,
            },
            theme: 'purple',
        })
    )

    // Rota padrão do Swagger (opcional, já que estamos usando o Scalar)
    SwaggerModule.setup('swagger', app, document)

    const port = process.env.PORT || 3000
    await app.listen(port)
    logger.log(`Application running on port ${port}`, 'Bootstrap')
    logger.log(`Scalar API documentation available at: http://localhost:${port}/api-docs`, 'Bootstrap')
    logger.log(`Swagger documentation available at: http://localhost:${port}/swagger`, 'Bootstrap')
}
bootstrap().catch((err) => {
    console.error('Error starting application:', err)
    process.exit(1)
})
