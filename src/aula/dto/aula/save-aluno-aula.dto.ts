import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsEmpty } from 'class-validator';

export class SaveAlunoAulaDto {
    @IsNumber()
    @IsEmpty({ message: 'Id da Aula obrigatório' })
    @ApiProperty({
        description: 'ID da aula atual para passar para a próxima',
    })
    aula_id: number;

    @ApiProperty({
        description: 'Resposta correta caso a aula seja do tipo exercício',
    })
    resposta?: number;
}
