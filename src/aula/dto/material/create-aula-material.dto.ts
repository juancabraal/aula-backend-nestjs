import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAulaMaterialDto {
    @IsNotEmpty({
        message: 'Título obrigatório',
    })
    @ApiProperty({
        description: 'Título do material',
        example: 'Etapa',
    })
    titulo: string;

    @IsNotEmpty({
        message: 'Descrição obrigatório',
    })
    @ApiProperty({
        description: 'Descrição do material, pode ser uma página html',
        example: 'Etapa',
        format: 'textarea',
    })
    descricao: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'Imagem de destaque do material',
        type: 'string',
        format: 'binary',
    })
    image: any;

    @ApiProperty({
        description: 'Arquivos a serem disponibilizados para download',
        type: 'array',
        items: {
            type: 'file',
            items: {
                type: 'string',
                format: 'binary',
            },
        },
    })
    download?: any[];

    @IsNumber()
    @IsNotEmpty({
        message: 'Duração obrigatório',
    })
    @ApiProperty({
        description: 'Duração do material, em minutos',
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
