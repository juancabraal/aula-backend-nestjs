import { HttpException, Injectable, Query } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Connection, EntityNotFoundError, Repository } from 'typeorm';

import { striptags } from 'striptags';

import { CreateAulaExercicioDto } from '../dto/exercicio/create-aula-exercicio.dto';

import { UpdateAulaExercicioDto } from '../dto/exercicio/update-aula-exercicio.dto';

import { AulaExercicio } from '../entities/aula.exercicio.entity';

import { AulaExercicioQuestoes } from '../entities/aula.exercicio.questoes.entity';

import { Questoes } from '../entities/questoes.entity';

import { Aula, AulaType } from '../entities/aula.entity';

import { UtilService } from '../../utils/utils.service';

@Injectable()
export class AulaExercicioService {
    constructor(
        @InjectRepository(Aula)
        private aulaRepository: Repository<Aula>,
        @InjectRepository(AulaExercicio)
        private aulaExercicioRepository: Repository<AulaExercicio>,
        @InjectRepository(AulaExercicioQuestoes)
        private aulaExercicioQuestoesRepository: Repository<AulaExercicioQuestoes>,
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

        return await this.aulaExercicioRepository.find({ where: where });
    }

    async findOne(id: number) {
        return await this.aulaExercicioRepository.findOneOrFail(id);
    }

    async create(createAulaExercicioDto: CreateAulaExercicioDto) {
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

            let exercicio: AulaExercicio = new AulaExercicio();

            exercicio.titulo = this.utilService.shortString(
                striptags(questao.enunciado),
                100,
            );
            exercicio.descricao = questao.enunciado;
            exercicio.dificuldade = questao.dificuldade;
            exercicio.image = this.utilService.getImageFromHtml(
                questao.enunciado,
            );

            exercicio = this.aulaExercicioRepository.create(exercicio);

            const exercicioAulaResponse = await queryRunner.manager.save(
                exercicio,
            );

            let questoesResponse = {};

            if (questao.a && questao.a !== '') {
                let questaoA: AulaExercicioQuestoes = new AulaExercicioQuestoes();

                questaoA.descricao = questao.a;
                questaoA.AulaExercicio = exercicioAulaResponse;

                questaoA = this.aulaExercicioQuestoesRepository.create(
                    questaoA,
                );

                questoesResponse['a'] = await queryRunner.manager.save(
                    questaoA,
                );
            }

            if (questao.b && questao.b !== '') {
                let questaoB: AulaExercicioQuestoes = new AulaExercicioQuestoes();

                questaoB.descricao = questao.b;
                questaoB.AulaExercicio = exercicioAulaResponse;

                questaoB = this.aulaExercicioQuestoesRepository.create(
                    questaoB,
                );

                questoesResponse['b'] = await queryRunner.manager.save(
                    questaoB,
                );
            }

            if (questao.c && questao.c !== '') {
                let questaoC: AulaExercicioQuestoes = new AulaExercicioQuestoes();

                questaoC.descricao = questao.c;
                questaoC.AulaExercicio = exercicioAulaResponse;

                questaoC = this.aulaExercicioQuestoesRepository.create(
                    questaoC,
                );

                questoesResponse['c'] = await queryRunner.manager.save(
                    questaoC,
                );
            }

            if (questao.d && questao.d !== '') {
                let questaoD: AulaExercicioQuestoes = new AulaExercicioQuestoes();

                questaoD.descricao = questao.d;
                questaoD.AulaExercicio = exercicioAulaResponse;

                questaoD = this.aulaExercicioQuestoesRepository.create(
                    questaoD,
                );

                questoesResponse['d'] = await queryRunner.manager.save(
                    questaoD,
                );
            }

            if (questao.e && questao.e !== '') {
                let questaoE: AulaExercicioQuestoes = new AulaExercicioQuestoes();

                questaoE.descricao = questao.e;
                questaoE.AulaExercicio = exercicioAulaResponse;

                questaoE = this.aulaExercicioQuestoesRepository.create(
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
                    AulaExercicio,
                    {
                        id: exercicioAulaResponse.id,
                    },
                    exercicioAulaResponse,
                );

                await this.aulaExercicioRepository.update(
                    exercicioAulaResponse.id,
                    exercicioAulaResponse,
                );
            } else {
                await queryRunner.manager.delete(AulaExercicio, {
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

            aula.tipo = AulaType.Exercicio;
            aula.exercicio = exercicioAulaResponse;
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

    async update(id: number, updateAulaExercicioDto: UpdateAulaExercicioDto) {
        try {
            let exercicio = await this.aulaExercicioRepository.findOneOrFail(
                id,
            );

            exercicio.titulo = updateAulaExercicioDto.titulo;
            exercicio.descricao = updateAulaExercicioDto.descricao;

            exercicio = this.aulaExercicioRepository.create(exercicio);

            return await this.aulaExercicioRepository.save(exercicio);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Questão não encontrada', 404);
            } else throw error;
        }
    }

    async remove(id: number) {
        try {
            await this.aulaExercicioRepository.findOneOrFail(id);

            return await this.aulaExercicioRepository.delete(id);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException('Questão não encontrada', 404);
            } else throw error;
        }
    }
}
