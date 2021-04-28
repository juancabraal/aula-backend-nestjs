import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorageModule } from '@nestjs/azure-storage';

import { AulaService } from './services/aula.service';
import { AulaVideoService } from './services/aula.video.service';
import { AulaMaterialService } from './services/aula.material.service';
import { AulaExercicioService } from './services/aula.exercicio.service';
import { AulaExercicioMaisUmService } from './services/aula.exercicio-mais-um.service';

import { AulaController } from './controllers/aula.controller';
import { AulaVideoController } from './controllers/aula.video.controller';
import { AulaMaterialController } from './controllers/aula.material.controller';
import { AulaExercicioController } from './controllers/aula.exercicio.controller';
import { AulaExercicioMaisUmController } from './controllers/aula.exercicio-mais-um.controller';

import { Aula } from './entities/aula.entity';
import { AulaVideo } from './entities/aula.video.entity';
import { AulaMaterial } from './entities/aula.material.entity';
import { AulaExercicio } from './entities/aula.exercicio.entity';
import { AulaExercicioQuestoes } from './entities/aula.exercicio.questoes.entity';
import { AulaExercicioMaisUmQuestoes } from './entities/aula.exercicio-mais-um.questoes.entity';
import { AulaExercicioMaisUm } from './entities/aula.exercicio-mais-um.entity';
import { Questoes } from './entities/questoes.entity';

import { AulaSubscriber } from './subscribers/aula.subscriber';

import { UtilService } from '../utils/utils.service';
import { UploadService } from '../utils/upload.service';
import { AulaConcluida } from './entities/aula.concluida.entity';

@Module({
    imports: [
        AzureStorageModule.withConfig({
            sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
            accountName: process.env['AZURE_STORAGE_NAME'],
            containerName: process.env['AZURE_STORAGE_CONTAINER'],
        }),
        TypeOrmModule.forFeature([
            Aula,
            AulaConcluida,
            AulaVideo,
            AulaMaterial,
            AulaExercicio,
            AulaExercicioQuestoes,
            AulaExercicioMaisUmQuestoes,
            AulaExercicioMaisUm,
        ]),
        TypeOrmModule.forFeature([Questoes], 'questao'),
        UtilService,
        UploadService,
    ],
    controllers: [
        AulaVideoController,
        AulaMaterialController,
        AulaExercicioController,
        AulaController,
        AulaExercicioMaisUmController,
    ],
    providers: [
        AulaService,
        AulaVideoService,
        AulaMaterialService,
        AulaExercicioService,
        AulaExercicioMaisUmService,
        UtilService,
        UploadService,
        AulaSubscriber,
    ],
})
export class AulaModule {}
