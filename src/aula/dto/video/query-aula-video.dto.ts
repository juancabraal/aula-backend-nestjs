import { ApiProperty } from '@nestjs/swagger';

export enum VideoType {
    Youtube = 'Youtube',
    Vimeo = 'Vimeo',
}

export class QueryAulaVideoDto {
    @ApiProperty({
        description: 'Título do vídeo',
    })
    titulo?: string;

    @ApiProperty({
        description: 'Descrição do vídeo',
    })
    descricao?: string;

    @ApiProperty({
        enum: VideoType,
        description: 'Tipo de vídeo',
    })
    type?: VideoType;

    @ApiProperty({
        description: 'ID do Módulo',
    })
    modulo_id?: number;
}
