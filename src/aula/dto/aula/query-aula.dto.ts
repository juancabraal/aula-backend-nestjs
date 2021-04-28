import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { AulaType } from '../../entities/aula.entity';

export class QueryAulaDto {
    @IsNumber()
    @ApiProperty({
        description: 'ID da aula atual para passar para a próxima',
    })
    nextId?: number;

    @IsNumber()
    @ApiProperty({
        description: 'ID da aula atual para passar para a aula anterior',
    })
    prevId?: number;

    @ApiProperty({
        enum: AulaType,
        description: 'Tipo de aula',
    })
    tipo?: AulaType;
}
