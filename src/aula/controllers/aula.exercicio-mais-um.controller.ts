import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AulaExercicioMaisUmService } from '../services/aula.exercicio-mais-um.service';

import { CreateAulaExercicioMaisUmDto } from '../dto/exercicio_mais_um/create-aula-exercicio-mais-um.dto';

import { UpdateAulaExercicioMaisUmDto } from '../dto/exercicio_mais_um/update-aula-exercicio-mais-um.dto';

import { QueryAulaExercicioMaisUmDto } from '../dto/exercicio_mais_um/query-aula-exercicio-mais-um.dto';

@Controller('api/aula/exercicio-mais-um')
export class AulaExercicioMaisUmController {
    constructor(private readonly aulaExercicioMaisUmService: AulaExercicioMaisUmService) {}

    @ApiOperation({
        summary: 'Listar exercicios',
        description: 'Listar exercicios',
    })
    @ApiTags('Exercicio Mais Um')
    @Get()
    findAll(@Query() query: QueryAulaExercicioMaisUmDto) {
        return this.aulaExercicioMaisUmService.findAll(query);
    }

    @ApiOperation({
        summary: 'Encontrar exercicio por id',
        description: 'Encontrar exercicio por id',
    })
    @ApiTags('Exercicio Mais Um')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aulaExercicioMaisUmService.findOne(+id);
    }

    @ApiOperation({
        summary: 'Adicionar aula com exercicio',
        description: 'Adicionar aula com exercicio',
    })
    @ApiTags('Exercicio Mais Um')
    @Post()
    create(@Body() createAulaExercicioMaisUmDto: CreateAulaExercicioMaisUmDto) {
        return this.aulaExercicioMaisUmService.create(createAulaExercicioMaisUmDto);
    }

    @ApiOperation({
        summary: 'Editar exercicio',
        description: 'Editar exercicio',
    })
    @ApiTags('Exercicio Mais Um')
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateAulaExercicioMaisUmDto: UpdateAulaExercicioMaisUmDto,
    ) {
        return this.aulaExercicioMaisUmService.update(+id, updateAulaExercicioMaisUmDto);
    }

    @ApiOperation({
        summary: 'Deletar exercicio',
        description: 'Deletar exercicio',
    })
    @ApiTags('Exercicio Mais Um')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aulaExercicioMaisUmService.remove(+id);
    }
}
