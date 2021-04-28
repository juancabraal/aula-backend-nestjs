import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAulaExercicioDto {
    @IsNotEmpty({
        message: 'Título obrigatório',
    })
    @ApiProperty({
        description: 'Título do exercicio',
        example: 'Etapa',
    })
    titulo: string;

    @IsNotEmpty({
        message: 'Descrição obrigatório',
    })
    @ApiProperty({
        description: 'Descrição do exercicio, pode ser uma página html',
        example: 'Etapa',
        format: 'textarea',
    })
    descricao: string;

    @IsNumber()
    @IsNotEmpty({
        message: 'Duração obrigatório',
    })
    @ApiProperty({
        description: 'Duração do exercício, em minutos',
    })
    duracao: number;
}
