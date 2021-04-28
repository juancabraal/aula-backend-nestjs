import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AulaVideo } from './aula.video.entity';

import { AulaMaterial } from './aula.material.entity';

import { AulaExercicio } from './aula.exercicio.entity';

import { AulaExercicioMaisUm } from './aula.exercicio-mais-um.entity';

export enum AulaType {
    Video = 'Video',
    Material = 'Material',
    Exercicio = 'Exercicio',
    ExercicioMaisUm = 'ExercicioMaisUm',
}

@Entity({
    name: 'aula',
})
export class Aula {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Tipo de aula',
        example: 'Video',
        enum: AulaType,
        default: 'Video',
    })
    @Column({ enum: AulaType })
    tipo: AulaType;

    @ApiProperty({
        description: 'ID do registro de vídeo',
    })
    @OneToOne(() => AulaVideo)
    @JoinColumn({ name: 'aula_video_id' })
    video: AulaVideo;

    @ApiProperty({
        description: 'ID do registro de vídeo',
    })
    @OneToOne(() => AulaMaterial)
    @JoinColumn({ name: 'aula_material_id' })
    material: AulaMaterial;

    @ApiProperty({
        description: 'ID do registro do aula',
    })
    @OneToOne(() => AulaExercicio)
    @JoinColumn({ name: 'aula_exercicio_id' })
    exercicio: AulaExercicio;

    @ApiProperty({
        description: 'ID do registro do aula de exercicio mais um',
    })
    @OneToOne(() => AulaExercicioMaisUm)
    @JoinColumn({ name: 'aula_exercicio_mais_um_id' })
    exercicioMaisUm: AulaExercicioMaisUm;

    @ApiProperty({
        description: 'ID do Módulo',
    })
    @Column({ name: 'modulo_id' })
    moduloId: number;

    @ApiProperty({
        description: 'Ordem do aula',
    })
    @Column()
    ordem: number;

    @ApiProperty({
        description: 'Duração da aula',
    })
    @Column()
    duracao: number;

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
