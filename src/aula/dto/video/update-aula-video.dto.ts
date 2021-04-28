import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export enum VideoType {
    Youtube = 'Youtube',
    Vimeo = 'Vimeo',
}

export class UpdateAulaVideoDto {
    @IsNotEmpty({
        message: 'Título obrigatório',
    })
    @ApiProperty({
        description: 'Título do vídeo',
        example: 'Etapa',
    })
    titulo: string;

    @IsNotEmpty({
        message: 'Descrição obrigatório',
    })
    @ApiProperty({
        description: 'Descrição do vídeo, pode ser uma página html',
        example: 'Etapa',
        format: 'textarea',
    })
    descricao: string;

    @IsNotEmpty({
        message: 'Tipo de vídeo obrigatório',
    })
    @ApiProperty({
        enum: VideoType,
        description: 'Tipo de vídeo',
    })
    type: VideoType;

    @IsNotEmpty({
        message: 'URL do vídeo obrigatório',
    })
    @ApiProperty({
        description: 'URL do vídeo',
        example: 'https://www.youtube.com/watch?v=Vmb1tqYqyII',
    })
    url: string;

    @IsNumber()
    @IsNotEmpty({
        message: 'Duração obrigatório',
    })
    @ApiProperty({
        description: 'Duração do vídeo, em minutos',
    })
    duracao: number;
}
