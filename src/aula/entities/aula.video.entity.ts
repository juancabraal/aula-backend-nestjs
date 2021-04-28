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

import { VideoType } from '../dto/video/create-aula-video.dto';

@Entity({
    name: 'aula_video',
})
export class AulaVideo {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Título do vídeo',
        example: 'Etapa',
    })
    @Column()
    titulo: string;

    @ApiProperty({
        description: 'Descrição do vídeo, pode ser uma página html',
        example: 'Etapa',
    })
    @Column()
    descricao: string;

    @ApiProperty({
        enum: VideoType,
        default: 'youtube',
        description: 'Tipo de vídeo',
    })
    @Column({ enum: VideoType })
    type: string;

    @ApiProperty({
        description: 'URL do vídeo',
        example: 'https://www.youtube.com/watch?v=Vmb1tqYqyII',
    })
    @Column()
    url: string;

    @ApiProperty({
        description: 'Thumbnail do vídeo',
    })
    @Column()
    thumbnail: string;

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
