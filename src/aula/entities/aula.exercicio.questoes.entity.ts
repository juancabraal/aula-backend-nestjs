import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AulaExercicio } from './aula.exercicio.entity';

@Entity({
    name: 'aula_exercicio_questoes',
})
export class AulaExercicioQuestoes {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Descrição da questão',
        example: 'Etapa',
    })
    @Column()
    descricao: string;

    @ApiProperty({
        description: 'Link para download de conteúdos',
    })
    @OneToOne(() => AulaExercicio, (exercicio) => exercicio.id)
    @JoinColumn({ name: 'aula_exercicio_id' })
    AulaExercicio: AulaExercicio;

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
