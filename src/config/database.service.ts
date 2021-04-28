import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DatabaseService {
    public static configService: ConfigService = new ConfigService();

    public static createAzureTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: parseInt(this.configService.get('DB_PORT')),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_DATABASE'),
            autoLoadEntities: true,
            ssl: true,
        };
    }

    public static createQuestaoTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            name: 'questao',
            host: this.configService.get('QUESTAO_DB_HOST'),
            port: parseInt(this.configService.get('QUESTAO_DB_PORT')),
            username: this.configService.get('QUESTAO_DB_USER'),
            password: this.configService.get('QUESTAO_DB_PASSWORD'),
            database: this.configService.get('QUESTAO_DB_DATABASE'),
            autoLoadEntities: true,
        };
    }
}
