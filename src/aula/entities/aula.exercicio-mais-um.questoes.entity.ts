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

import { AulaExercicioMaisUm } from './aula.exercicio-mais-um.entity';

@Entity({
    name: 'aula_exercicio_mais_um_questoes',
})
export class AulaExercicioMaisUmQuestoes {
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
    @OneToOne(() => AulaExercicioMaisUm, (exercicio) => exercicio.id)
    @JoinColumn({ name: 'aula_exercicio_mais_um_id' })
    AulaExercicioMaisUm: AulaExercicioMaisUm;

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
