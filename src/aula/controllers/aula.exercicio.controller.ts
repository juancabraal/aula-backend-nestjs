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

import { AulaExercicioService } from '../services/aula.exercicio.service';

import { CreateAulaExercicioDto } from '../dto/exercicio/create-aula-exercicio.dto';

import { UpdateAulaExercicioDto } from '../dto/exercicio/update-aula-exercicio.dto';

import { QueryAulaExercicioDto } from '../dto/exercicio/query-aula-exercicio.dto';

@Controller('api/aula/exercicio')
export class AulaExercicioController {
    constructor(private readonly aulaExercicioService: AulaExercicioService) {}

    @ApiOperation({
        summary: 'Listar exercicios',
        description: 'Listar exercicios',
    })
    @ApiTags('Exercicio')
    @Get()
    findAll(@Query() query: QueryAulaExercicioDto) {
        return this.aulaExercicioService.findAll(query);
    }

    @ApiOperation({
        summary: 'Encontrar exercicio por id',
        description: 'Encontrar exercicio por id',
    })
    @ApiTags('Exercicio')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aulaExercicioService.findOne(+id);
    }

    @ApiOperation({
        summary: 'Adicionar aula com exercicio',
        description: 'Adicionar aula com exercicio',
    })
    @ApiTags('Exercicio')
    @Post()
    create(@Body() createAulaExercicioDto: CreateAulaExercicioDto) {
        return this.aulaExercicioService.create(createAulaExercicioDto);
    }

    @ApiOperation({
        summary: 'Editar exercicio',
        description: 'Editar exercicio',
    })
    @ApiTags('Exercicio')
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateAulaExercicioDto: UpdateAulaExercicioDto,
    ) {
        return this.aulaExercicioService.update(+id, updateAulaExercicioDto);
    }

    @ApiOperation({
        summary: 'Deletar exercicio',
        description: 'Deletar exercicio',
    })
    @ApiTags('Exercicio')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aulaExercicioService.remove(+id);
    }
}
