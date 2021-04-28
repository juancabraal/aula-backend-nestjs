import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaModule } from './aula/aula.module';
import { DatabaseService } from './config/database.service';
import { UtilService } from './utils/utils.service';
import { UploadService } from './utils/upload.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AllExceptionsFilter } from './exceptions/http-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(DatabaseService.createAzureTypeOrmOptions()),
        TypeOrmModule.forRoot(DatabaseService.createQuestaoTypeOrmOptions()),
        AulaModule,
        HttpModule,
    ],
    controllers: [],
    providers: [
        UtilService,
        UploadService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
