import { HttpException, Injectable, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Connection, EntityNotFoundError, Repository } from 'typeorm';

import { striptags } from 'striptags';

import { CreateAulaExercicioMaisUmDto } from '../dto/exercicio_mais_um/create-aula-exercicio-mais-um.dto';

import { UpdateAulaExercicioMaisUmDto } from '../dto/exercicio_mais_um/update-aula-exercicio-mais-um.dto';

import { AulaExercicioMaisUm } from './../entities/aula.exercicio-mais-um.entity';

import { AulaExercicioMaisUmQuestoes } from '../entities/aula.exercicio-mais-um.questoes.entity';

import { Questoes } from '../entities/questoes.entity';

import { Aula, AulaType } from '../entities/aula.entity';

import { UtilService } from '../../utils/utils.service';

@Injectable()
export class AulaExercicioMaisUmService {
    constructor(
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,
        @InjectRepository(AulaExercicioMaisUm)
        private aulaExercicioMaisUmRepository: Repository<AulaExercicioMaisUm>,
        @InjectRepository(AulaExercicioMaisUmQuestoes)
        private aulaExercicioMaisUmQuestoesRepository: Repository<AulaExercicioMaisUmQuestoes>,
        @InjectRepository(Questoes, 'questao')
        private questoesRepository: Repository<Questoes>,
        private utilService: UtilService,
        private connection: Connection,
    ) {}

    async findAll(@Query() query) {
        let where = {};

        Object.keys(query).map((key) => {
            where[key] = query[key];
        });

        return await this.aulaExercicioMaisUmRepository.find({ where: where });
    }

    async findOne(id: number) {
        return await this.aulaExercicioMaisUmRepository.findOneOrFail(id);
    }

    async create(createAulaExercicioDto: CreateAulaExercicioMaisUmDto) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.utilService.veryModuloIdExist(
                createAulaExercicioDto.modulo_id,
            );

            const questao = await this.questoesRepository.findOneOrFail(
                createAulaExercicioDto.id,
            );

            let exercicio: AulaExercicioMaisUm = new AulaExercicioMaisUm();

            exercicio.titulo = this.utilService.shortString(
                striptags(questao.enunciado),
                100,
            );
            exercicio.descricao = questao.enunciado;
            exercicio.dificuldade = questao.dificuldade;
            exercicio.image = this.utilService.getImageFromHtml(
                questao.enunciado,
            );

            exercicio = this.aulaExercicioMaisUmRepository.create(exercicio);

            const exercicioAulaResponse = await queryRunner.manager.save(
                exercicio,
            );

            let questoesResponse = {};

            if (questao.a && questao.a !== '') {
                let questaoA: AulaExercicioMaisUmQuestoes = new AulaExercicioMaisUmQuestoes();

                questaoA.descricao = questao.a;
                questaoA.AulaExercicioMaisUm = exercicioAulaResponse;

                questaoA = this.aulaExercicioMaisUmQuestoesRepository.create(
                    questaoA,
                );

                questoesResponse['a'] = await queryRunner.manager.save(
                    questaoA,
                );
            }

            if (questao.b && questao.b !== '') {
                let questaoB: AulaExercicioMaisUmQuestoes = new AulaExercicioMaisUmQuestoes();

                questaoB.descricao = questao.b;
                questaoB.AulaExercicioMaisUm = exercicioAulaResponse;

                questaoB = this.aulaExercicioMaisUmQuestoesRepository.create(
                    questaoB,
                );

                questoesResponse['b'] = await queryRunner.manager.save(
                    questaoB,
                );
            }

            if (questao.c && questao.c !== '') {
                let questaoC: AulaExercicioMaisUmQuestoes = new AulaExercicioMaisUmQuestoes();

                questaoC.descricao = questao.c;
                questaoC.AulaExercicioMaisUm = exercicioAulaResponse;

                questaoC = this.aulaExercicioMaisUmQuestoesRepository.create(
                    questaoC,
                );

                questoesResponse['c'] = await queryRunner.manager.save(
                    questaoC,
                );
            }

            if (questao.d && questao.d !== '') {
                let questaoD: AulaExercicioMaisUmQuestoes = new AulaExercicioMaisUmQuestoes();

                questaoD.descricao = questao.d;
                questaoD.AulaExercicioMaisUm = exercicioAulaResponse;

                questaoD = this.aulaExercicioMaisUmQuestoesRepository.create(
                    questaoD,
                );

                questoesResponse['d'] = await queryRunner.manager.save(
                    questaoD,
                );
            }

            if (questao.e && questao.e !== '') {
                let questaoE: AulaExercicioMaisUmQuestoes = new AulaExercicioMaisUmQuestoes();

                questaoE.descricao = questao.e;
                questaoE.AulaExercicioMaisUm = exercicioAulaResponse;

                questaoE = this.aulaExercicioMaisUmQuestoesRepository.create(
                    questaoE,
                );

                questoesResponse['e'] = await queryRunner.manager.save(
                    questaoE,
                );
            }

            if (questoesResponse[questao.resposta]) {
                exercicioAulaResponse.correta =
                    questoesResponse[questao.resposta];

                await queryRunner.manager.update(
                    AulaExercicioMaisUm,
                    {
                        id: exercicioAulaResponse.id,
                    },
                    exercicioAulaResponse,
                );

                await this.aulaExercicioMaisUmRepository.update(
                    exercicioAulaResponse.id,
                    exercicioAulaResponse,
                );
            } else {
                await queryRunner.manager.delete(AulaExercicioMaisUm, {
                    id: exercicioAulaResponse.id,
                });

                throw new HttpException(
                    'Não foi possível criar o exercício porque não existe resposta correta',
                    400,
                );
            }

            let lastOrdem = await this.aulaRepository.find({
                where: { moduloId: createAulaExercicioDto.modulo_id },
                order: { ordem: 'DESC' },
                take: 1,
            });

            let ordem = 1;

            if (lastOrdem.length > 0) {
                ordem = lastOrdem[0].ordem + 1;
            }

            let aula = new Aula();

            aula.tipo = AulaType.ExercicioMaisUm;
            aula.exercicioMaisUm = exercicioAulaResponse;
            aula.duracao = createAulaExercicioDto.duracao;
            aula.moduloId = createAulaExercicioDto.modulo_id;
            aula.ordem = ordem;

            aula = this.aulaRepository.create(aula);

            const aulaResponse = await queryRunner.manager.save(aula);

            await queryRunner.commitTransaction();

            return aulaResponse;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Questão não encontrada', 404);
            } else throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, updateAulaExercicioDto: UpdateAulaExercicioMaisUmDto) {
        try {
            let exercicio = await this.aulaExercicioMaisUmRepository.findOneOrFail(
                id,
            );

            exercicio.titulo = updateAulaExercicioDto.titulo;
            exercicio.descricao = updateAulaExercicioDto.descricao;

            exercicio = this.aulaExercicioMaisUmRepository.create(exercicio);

            return await this.aulaExercicioMaisUmRepository.save(exercicio);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Questão não encontrada', 404);
            } else throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.aulaExercicioMaisUmRepository.findOneOrFail(id);

            return await this.aulaExercicioMaisUmRepository.delete(id);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Questão não encontrada', 404);
            } else throw error;
        }
    }
}
