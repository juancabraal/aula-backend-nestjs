import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export enum DificuldadeEnum {
    facil = 'Fácil',
    medio = 'Médio',
    dificil = 'Difícil',
}

@Entity({
    name: 'questoes',
})
export class Questoes {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Enunciado do exercício',
    })
    @Column()
    enunciado: string;

    @ApiProperty({
        description: 'Dificuldade do exercício',
    })
    @Column({ enum: DificuldadeEnum })
    dificuldade: DificuldadeEnum;

    @ApiProperty({
        description: 'Questão A',
    })
    @Column()
    a: string;

    @ApiProperty({
        description: 'Questão B',
    })
    @Column()
    b: string;

    @ApiProperty({
        description: 'Questão C',
    })
    @Column()
    c: string;

    @ApiProperty({
        description: 'Questão D',
    })
    @Column()
    d: string;

    @ApiProperty({
        description: 'Questão E',
    })
    @Column()
    e: string;

    @ApiProperty({
        description: 'Resposta correta',
    })
    @Column()
    resposta: string;
}
