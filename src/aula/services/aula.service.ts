import { HttpException, Injectable, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
    Connection,
    MoreThan,
    Repository,
    getManager,
    Raw,
    LessThan,
    FindManyOptions,
} from 'typeorm';

import { Aula, AulaType } from '../entities/aula.entity';

import { UtilService } from '../../utils/utils.service';

import { QueryAulaDto } from '../dto/aula/query-aula.dto';

import { SaveAlunoAulaDto } from '../dto/aula/save-aluno-aula.dto';

import { AulaExercicioQuestoes } from '../entities/aula.exercicio.questoes.entity';

import { AulaConcluida } from '../entities/aula.concluida.entity';

@Injectable()
export class AulaService {
    constructor(
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,
        @InjectRepository(AulaConcluida)
        private aulaConcluidaRepository: Repository<AulaConcluida>,
        @InjectRepository(AulaExercicioQuestoes)
        private aulaExercicioQuestoesRepository: Repository<AulaExercicioQuestoes>,
        private utilService: UtilService,
        private connection: Connection,
    ) {}

    async getTrilha(
        moduloId: number,
        @Query() query: QueryAulaDto,
        token: string,
    ) {
        try {
            await this.utilService.veryModuloIdExist(moduloId);

            const headerSplit = String(token).split(' ');

            if (headerSplit.length !== 2) {
                throw new HttpException('Token inválido', 400);
            }

            token = headerSplit[1];

            const token_split = String(token).split('.');

            const buff = Buffer.from(token_split[1], 'base64');

            const payload = JSON.parse(buff.toString());

            const email = payload.emails[0];

            const entityManager = getManager();

            let idsAulasConcluidas = await entityManager.query(
                `SELECT aula.id AS id FROM aula INNER JOIN aula_concluida ON aula_concluida.aula_id = aula.id WHERE aula_concluida.usuario = '${email}' AND aula.modulo_id = ${moduloId}`,
            );

            idsAulasConcluidas = idsAulasConcluidas.map((value) => value.id);

            let currentQuerry = {};

            if (idsAulasConcluidas.length > 0) {
                currentQuerry = {
                    id: Raw(
                        (alias) => `${alias} NOT IN(${idsAulasConcluidas})`,
                    ),
                };
            }

            if (query.nextId) {
                currentQuerry = {
                    id: MoreThan(query.nextId),
                };
            }

            if (query.prevId) {
                currentQuerry = {
                    id: LessThan(query.prevId),
                };
            }

            let findQuery: FindManyOptions<Aula> = {
                where: {
                    moduloId,
                    ...currentQuerry,
                },
                order: {
                    ordem: query.prevId ? 'DESC' : 'ASC',
                },
                take: 1,
                relations: [
                    'video',
                    'material',
                    'exercicio',
                    'exercicio.correta',
                    'exercicio.questoes',
                ],
            };

            let aula = await this.aulaRepository.find(findQuery);

            if (aula.length === 0) {
                aula = await this.aulaRepository.find({
                    where: { moduloId },
                    order: { ordem: 'ASC' },
                    take: 1,
                    relations: [
                        'video',
                        'material',
                        'exercicio',
                        'exercicio.questoes',
                    ],
                });
            }

            if (aula.length > 0) {
                let aulaAtual = aula[0];

                const nextAula = await this.aulaRepository.findAndCount({
                    moduloId,
                    ordem: MoreThan(aulaAtual.ordem),
                });

                const prevAula = await this.aulaRepository.findAndCount({
                    moduloId,
                    ordem: LessThan(aulaAtual.ordem),
                });

                return {
                    next: nextAula[1] > 0,
                    prev: prevAula[1] > 0,
                    data: aulaAtual,
                };
            }

            return {
                next: false,
                data: {},
                prev: false,
            };
        } catch (error) {
            throw error;
        }
    }

    async getAula(
        moduloId: number,
        @Query() query: QueryAulaDto,
        token: string,
    ) {
        try {
            await this.utilService.veryModuloIdExist(moduloId);

            if (!query.tipo) {
                return this.getTrilha(moduloId, query, token);
            }

            return await this.aulaRepository.find({
                where: { moduloId, tipo: query.tipo },
                relations: [
                    'video',
                    'material',
                    'exercicio',
                    'exercicio.correta',
                    'exercicio.questoes',
                ],
            });
        } catch (error) {
            throw error;
        }
    }

    async concluirAula(token: string, saveAlunoAulaDto: SaveAlunoAulaDto) {
        const headerSplit = String(token).split(' ');

        if (headerSplit.length !== 2) {
            throw new HttpException('Token inválido', 400);
        }

        token = headerSplit[1];

        const token_split = String(token).split('.');

        const buff = Buffer.from(token_split[1], 'base64');

        const payload = JSON.parse(buff.toString());

        const email = payload.emails[0];

        const aula = await this.aulaRepository.findOne({
            where: {
                id: saveAlunoAulaDto.aula_id,
            },
            relations: ['video', 'material', 'exercicio', 'exercicio.correta'],
        });

        if (!aula) {
            throw new HttpException('Aula não encontrada', 400);
        }

        let aulaConcluida = await this.aulaConcluidaRepository.findOne({
            aulaId: saveAlunoAulaDto.aula_id,
            usuario: email,
        });

        if (!aulaConcluida) {
            aulaConcluida = new AulaConcluida();
        }

        aulaConcluida.aulaId = saveAlunoAulaDto.aula_id;
        aulaConcluida.usuario = email;

        let correta = true;

        if (aula.tipo === AulaType.Exercicio) {
            const questao = await this.aulaExercicioQuestoesRepository.findOne(
                saveAlunoAulaDto.resposta,
            );

            if (!questao) {
                throw new HttpException(
                    'ID da resposta informada não existe',
                    400,
                );
            }

            aulaConcluida.resposta = saveAlunoAulaDto.resposta;

            correta = aula.exercicio.correta.id == saveAlunoAulaDto.resposta;
        }

        aulaConcluida.correta = correta;

        aulaConcluida = this.aulaConcluidaRepository.create(aulaConcluida);

        return await this.aulaConcluidaRepository.save(aulaConcluida);
    }

    async removeConcluirAula(token: string, aulaId: number) {
        const headerSplit = String(token).split(' ');

        if (headerSplit.length !== 2) {
            throw new HttpException('Token inválido', 400);
        }

        token = headerSplit[1];

        const token_split = String(token).split('.');

        const buff = Buffer.from(token_split[1], 'base64');

        const payload = JSON.parse(buff.toString());

        const email = payload.emails[0];

        let aulaConcluida = await this.aulaConcluidaRepository.find({
            aulaId: aulaId,
            usuario: email,
        });

        return await this.aulaConcluidaRepository.remove(aulaConcluida);
    }

    async verificarAula(token: string, aulaId: number) {
        const headerSplit = String(token).split(' ');

        if (headerSplit.length !== 2) {
            throw new HttpException('Token inválido', 400);
        }

        token = headerSplit[1];

        const token_split = String(token).split('.');

        const buff = Buffer.from(token_split[1], 'base64');

        const payload = JSON.parse(buff.toString());

        const email = payload.emails[0];

        const aula = await this.aulaConcluidaRepository.findOne({
            aulaId,
            usuario: email,
        });

        if (aula) {
            return aula;
        }

        return {};
    }

    async getInfo(moduloId: number) {
        return await this.connection.query(
            `SELECT SUM(aula.duracao) AS duracao, COUNT(aula.id) AS total, tipo FROM aula WHERE modulo_id = ${moduloId} GROUP BY tipo`,
        );
    }

    async getProgresso(moduloId: number, token: string) {
        const headerSplit = String(token).split(' ');

        if (headerSplit.length !== 2) {
            throw new HttpException('Token inválido', 400);
        }

        token = headerSplit[1];

        const token_split = String(token).split('.');

        const buff = Buffer.from(token_split[1], 'base64');

        const payload = JSON.parse(buff.toString());

        const email = payload.emails[0];

        return await this.connection.query(
            `select aula.id as aula_id, aula.modulo_id as modulo_id, aula.tipo as aula_tipo, aula_concluida.id as concluida_id, aula_concluida.created_at as concluida_data, aula_video.titulo as video_titulo, aula_video.id as video_id, aula_material.titulo as material_titulo, aula_material.id as material_id, aula_exercicio.titulo as exercicio_titulo, aula_exercicio.id as exercicio_id from aula left join aula_video on aula.aula_video_id = aula_video.id left join aula_material on aula.aula_material_id = aula_material.id left join aula_exercicio on aula.aula_exercicio_id = aula_exercicio.id left join aula_concluida on aula.id = aula_concluida.aula_id and aula_concluida.usuario = '${email}' where aula.modulo_id = ${moduloId} order by aula.ordem ASC`,
        );
    }

    async getProgressoResume(moduloId: number, token: string) {
        const headerSplit = String(token).split(' ');

        if (headerSplit.length !== 2) {
            throw new HttpException('Token inválido', 400);
        }

        token = headerSplit[1];

        const token_split = String(token).split('.');

        const buff = Buffer.from(token_split[1], 'base64');

        const payload = JSON.parse(buff.toString());

        const email = payload.emails[0];

        return await this.connection.query(
            `select total, feitos, feitos * 100 / total as porcentagem from (select count(aula.id) as total, (select count(aula_concluida.id) from aula_concluida inner join aula on aula.id = aula_concluida.aula_id and aula.modulo_id = ${moduloId} where aula_concluida.usuario = '${email}') as feitos from aula where aula.modulo_id = ${moduloId}) as aula_temp`,
        );
    }
}
