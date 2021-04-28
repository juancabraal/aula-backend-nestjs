if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerCustomOptions,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Etapa - Aula API')
        .setDescription('Aulas que ficam dentro dos módulos')
        .setVersion('1.0')
        .addTag('Aula')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    const customOptions: SwaggerCustomOptions = {
        explorer: true,
        customfavIcon:
            'https://link-enem-dev.venhapranuvem.com.br/assets/favicon.ico',
        customSiteTitle: 'ETAPA - Aula API',
    };

    SwaggerModule.setup('api/aula/swagger-ui', app, document, customOptions);

    await app.listen(configService.get('PORT'));
}
bootstrap();
