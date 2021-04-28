import { ApiProperty } from '@nestjs/swagger';

export class QueryAulaExercicioMaisUmDto {
    @ApiProperty({
        description: 'Título do material',
    })
    titulo?: string;

    @ApiProperty({
        description: 'Descrição do material',
    })
    descricao?: string;

    @ApiProperty({
        description: 'ID do Módulo',
    })
    modulo_id?: number;
}
