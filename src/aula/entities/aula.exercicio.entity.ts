import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AulaExercicioQuestoes } from './aula.exercicio.questoes.entity';
import { DificuldadeEnum } from '../entities/questoes.entity';

@Entity({
    name: 'aula_exercicio',
})
export class AulaExercicio {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Título do exercício',
        example: 'Etapa',
    })
    @Column()
    titulo: string;

    @ApiProperty({
        description: 'Descrição do exercício, pode ser uma página html',
        example: 'Etapa',
    })
    @Column()
    descricao: string;

    @ApiProperty({
        description: 'Dificuldade da questão',
        enum: DificuldadeEnum,
    })
    @Column()
    dificuldade: DificuldadeEnum;

    @ApiProperty({
        description: 'Imagem de destaque do exercício',
        example: 'Etapa',
    })
    @Column()
    image: string;

    @ApiProperty({
        description: 'Questão correta do exercício',
    })
    @OneToOne(() => AulaExercicioQuestoes, (exercicio) => exercicio.id)
    @JoinColumn({ name: 'correta' })
    correta: AulaExercicioQuestoes;

    @OneToMany(
        () => AulaExercicioQuestoes,
        (exercicios) => exercicios.AulaExercicio,
    )
    questoes: AulaExercicioQuestoes[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @BeforeInsert()
    fillDateFiels() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    updateDateFiels() {
        this.updatedAt = new Date();
    }
}
