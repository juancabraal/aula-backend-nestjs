import { HttpException, Injectable, Query } from '@nestjs/common';

import { UploadedFileMetadata } from '@nestjs/azure-storage';

import { InjectRepository } from '@nestjs/typeorm';

import { Connection, EntityNotFoundError, Repository } from 'typeorm';

import { CreateAulaMaterialDto } from '../dto/material/create-aula-material.dto';

import { UpdateAulaMaterialDto } from '../dto/material/update-aula-material.dto';

import { AulaMaterial } from '../entities/aula.material.entity';

import { Aula, AulaType } from '../entities/aula.entity';

import { UploadService } from '../../utils/upload.service';

import { UtilService } from '../../utils/utils.service';

@Injectable()
export class AulaMaterialService {
    constructor(
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,
        @InjectRepository(AulaMaterial)
        private aulaMaterialRepository: Repository<AulaMaterial>,
        private uploadService: UploadService,
        private utilService: UtilService,
        private connection: Connection,
    ) {}

    async findAll(@Query() query) {
        let where = {};

        Object.keys(query).map((key) => {
            where[key] = query[key];
        });

        return await this.aulaMaterialRepository.find({ where: where });
    }

    async findOne(id: number) {
        return await this.aulaMaterialRepository.findOneOrFail(id);
    }

    async create(
        createAulaMaterialDto: CreateAulaMaterialDto,
        files: UploadedFileMetadata,
    ) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();

        await queryRunner.startTransaction();

        try {
            await this.utilService.veryModuloIdExist(
                createAulaMaterialDto.modulo_id,
            );

            const imageKey = 'image';

            let imageFile = files[imageKey];

            const downloadKey = 'download';

            let downloadFiles = files[downloadKey];

            let imageName = '';

            let downloadNames = [];

            if (imageFile && imageFile.length > 0) {
                imageName = await this.uploadService.upload(imageFile[0]);
            }

            if (downloadFiles && downloadFiles.length > 0) {
                for (const file of downloadFiles) {
                    const downloadName = await this.uploadService.upload(file);

                    downloadNames.push(downloadName);
                }
            }

            let material: AulaMaterial = new AulaMaterial();

            material.titulo = createAulaMaterialDto.titulo;
            material.descricao = createAulaMaterialDto.descricao;
            material.image = imageName;
            material.download = downloadNames.join(',');

            material = this.aulaMaterialRepository.create(material);

            const materialAulaResponse = await queryRunner.manager.save(
                material,
            );

            let lastOrdem = await this.aulaRepository.find({
                where: { moduloId: createAulaMaterialDto.modulo_id },
                order: { ordem: 'DESC' },
                take: 1,
            });

            let ordem = 1;

            if (lastOrdem.length > 0) {
                ordem = lastOrdem[0].ordem + 1;
            }

            let aula = new Aula();

            aula.tipo = AulaType.Material;
            aula.material = materialAulaResponse;
            aula.moduloId = createAulaMaterialDto.modulo_id;
            aula.duracao = createAulaMaterialDto.duracao;
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
        updateAulaMaterialDto: UpdateAulaMaterialDto,
        files: UploadedFileMetadata,
    ) {
        try {
            let material = await this.aulaMaterialRepository.findOneOrFail(id);

            const imageKey = 'image';

            let imageFile = files[imageKey];

            const downloadKey = 'download';

            let downloadFiles = files[downloadKey];

            let imageName = material.image;

            let downloadNames = material.download.split(',');

            if (imageFile && imageFile.length > 0) {
                await this.uploadService.delete(material.image);

                imageName = await this.uploadService.upload(imageFile[0]);
            }

            let deleteFiles = [];

            if (updateAulaMaterialDto.uploaded) {
                const _downloadedFiles = Array.isArray(
                    updateAulaMaterialDto.uploaded,
                )
                    ? [...updateAulaMaterialDto.uploaded]
                    : [...String(updateAulaMaterialDto.uploaded).split(',')];

                deleteFiles = downloadNames.filter(
                    (x) => !_downloadedFiles.includes(x),
                );

                downloadNames = _downloadedFiles;
            } else {
                deleteFiles = downloadNames;

                downloadNames = [];
            }

            for (const file of deleteFiles) {
                await this.uploadService.delete(file);
            }

            if (downloadFiles && downloadFiles.length > 0) {
                for (const file of downloadFiles) {
                    const downloadName = await this.uploadService.upload(file);

                    downloadNames.push(downloadName);
                }
            }

            material.titulo = updateAulaMaterialDto.titulo;
            material.descricao = updateAulaMaterialDto.descricao;
            material.image = imageName;
            material.download = downloadNames.join(',');

            material = this.aulaMaterialRepository.create(material);

            return await this.aulaMaterialRepository.save(material);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Material não encontrado', 404);
            } else throw error;
        }
    }

    async remove(id: number) {
        try {
            const material = await this.aulaMaterialRepository.findOneOrFail(
                id,
            );

            if (material.image && material.image !== '') {
                await this.uploadService.delete(material.image);
            }

            if (material.download && material.download !== '') {
                const downloadFiles = material.download
                    .split(',')
                    .filter((value) => value.length > 1);

                for (const file of downloadFiles) {
                    await this.uploadService.delete(file);
                }
            }

            return await this.aulaMaterialRepository.delete(id);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Material não encontrado', 404);
            } else throw error;
        }
    }
}
