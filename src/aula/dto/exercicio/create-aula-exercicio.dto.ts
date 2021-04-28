import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAulaExercicioDto {
    @IsNumber()
    @IsNotEmpty({
        message: 'ID obrigatório',
    })
    @ApiProperty({
        description: 'ID do exercício',
    })
    id: number;

    @IsNumber()
    @IsNotEmpty({
        message: 'Duração obrigatório',
    })
    @ApiProperty({
        description: 'Duração do exercício, em minutos',
    })
    duracao: number;

    @IsNumber()
    @IsNotEmpty({
        message: 'Módulo ID obrigatório',
    })
    @ApiProperty({
        description: 'ID do Módulo',
    })
    modulo_id: number;
}
