import { HttpException, Injectable, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Connection, EntityNotFoundError, Repository } from 'typeorm';

import { CreateAulaVideoDto } from '../dto/video/create-aula-video.dto';

import { UpdateAulaVideoDto } from '../dto/video/update-aula-video.dto';

import { AulaVideo } from '../entities/aula.video.entity';

import { Aula, AulaType } from '../entities/aula.entity';

import { UtilService } from '../../utils/utils.service';

@Injectable()
export class AulaVideoService {
    constructor(
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,
        @InjectRepository(AulaVideo)
        private aulaVideoRepository: Repository<AulaVideo>,
        private utilService: UtilService,
        private connection: Connection,
    ) {}

    async findAll(@Query() query) {
        let where = {};

        Object.keys(query).map((key) => {
            where[key] = query[key];
        });

        return await this.aulaVideoRepository.find({ where: where });
    }

    async findOne(id: number) {
        return await this.aulaVideoRepository.findOneOrFail(id);
    }

    async create(createAulaVideoDto: CreateAulaVideoDto, thumbnail: string) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.utilService.veryModuloIdExist(
                createAulaVideoDto.modulo_id,
            );

            let video: AulaVideo = new AulaVideo();

            video.titulo = createAulaVideoDto.titulo;
            video.descricao = createAulaVideoDto.descricao;
            video.type = createAulaVideoDto.type;
            video.url = createAulaVideoDto.url;
            video.thumbnail = thumbnail;

            video = this.aulaVideoRepository.create(video);

            const videoAulaResponse = await queryRunner.manager.save(video);

            let lastOrdem = await this.aulaRepository.find({
                where: { moduloId: createAulaVideoDto.modulo_id },
                order: { ordem: 'DESC' },
                take: 1,
            });

            let ordem = 1;

            if (lastOrdem.length > 0) {
                ordem = lastOrdem[0].ordem + 1;
            }

            let aula = new Aula();

            aula.tipo = AulaType.Video;
            aula.video = videoAulaResponse;
            aula.moduloId = createAulaVideoDto.modulo_id;
            aula.duracao = createAulaVideoDto.duracao;
            aula.ordem = ordem;

            aula = this.aulaRepository.create(aula);

            const aulaResponse = await queryRunner.manager.save(aula);

            await queryRunner.commitTransaction();

            return aulaResponse;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(
        id: number,
        updateAulaVideoDto: UpdateAulaVideoDto,
        thumbnail: string,
    ) {
        try {
            let video = await this.aulaVideoRepository.findOneOrFail(id);

            video.titulo = updateAulaVideoDto.titulo;
            video.descricao = updateAulaVideoDto.descricao;
            video.type = updateAulaVideoDto.type;
            video.url = updateAulaVideoDto.url;
            video.thumbnail = thumbnail;

            video = this.aulaVideoRepository.create(video);

            return await this.aulaVideoRepository.save(video);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Vídeo não encontrado', 404);
            } else throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.aulaVideoRepository.findOneOrFail(id);

            return await this.aulaVideoRepository.delete(id);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Vídeo não encontrado', 404);
            } else throw error;
        }
    }
}
