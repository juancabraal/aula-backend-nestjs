import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'aula_material',
})
export class AulaMaterial {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Título do material',
        example: 'Etapa',
    })
    @Column()
    titulo: string;

    @ApiProperty({
        description: 'Descrição do material, pode ser uma página html',
        example: 'Etapa',
    })
    @Column()
    descricao: string;

    @ApiProperty({
        description: 'Imagem de destaque do material',
        example: 'Etapa',
    })
    @Column()
    image: string;

    @ApiProperty({
        description: 'Link para download de conteúdos',
    })
    @Column()
    download: string;

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
