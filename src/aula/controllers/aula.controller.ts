import {
    Controller,
    Get,
    Param,
    Query,
    Post,
    Body,
    Req,
    Delete,
} from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';

import { AulaService } from '../services/aula.service';

import { QueryAulaDto } from '../dto/aula/query-aula.dto';

import { SaveAlunoAulaDto } from '../dto/aula/save-aluno-aula.dto';

@Controller('api/aula')
export class AulaController {
    constructor(private readonly aulaService: AulaService) {}

    @ApiOperation({
        summary: 'Trilha do módulo',
        description: 'Trilha do módulo',
    })
    @ApiTags('Aula')
    @Get('trilha/:moduloId')
    getTrilhaByModuloId(
        @Param('moduloId') moduloId: string,
        @Query() query: QueryAulaDto,
        @Req() request: Request,
    ) {
        const token = request.get('Authorization');

        return this.aulaService.getTrilha(+moduloId, query, token);
    }

    @ApiOperation({
        summary: 'Aula do módulo',
        description: 'Aula do módulo',
    })
    @ApiTags('Aula')
    @Get('modulo/:moduloId/visualizar')
    getAulaByModuloId(
        @Param('moduloId') moduloId: string,
        @Query() query: QueryAulaDto,
        @Req() request: Request,
    ) {
        const token = request.get('Authorization');

        return this.aulaService.getAula(+moduloId, query, token);
    }

    @Get(':aulaId/concluida')
    getAlunoAula(@Param('aulaId') aulaId: string, @Req() request: Request) {
        const token = request.get('Authorization');

        return this.aulaService.verificarAula(token, +aulaId);
    }

    @Post('concluida')
    saveAulaConcluida(
        @Req() request: Request,
        @Body() saveAlunoAulaDto: SaveAlunoAulaDto,
    ) {
        const token = request.get('Authorization');

        return this.aulaService.concluirAula(token, saveAlunoAulaDto);
    }

    @Delete('concluida/:aulaId')
    removeAulaConcluida(
        @Param('aulaId') aulaId: string,
        @Req() request: Request,
    ) {
        const token = request.get('Authorization');

        return this.aulaService.removeConcluirAula(token, +aulaId);
    }

    @ApiOperation({
        summary: 'Informações por módulo',
        description: 'Informações por módulo',
    })
    @ApiTags('Aula')
    @Get('modulo/:moduloId')
    getInfo(@Param('moduloId') moduloId: string) {
        return this.aulaService.getInfo(+moduloId);
    }

    @ApiOperation({
        summary: 'Progresso do módulo',
        description: 'Progresso do módulo',
    })
    @ApiTags('Aula')
    @Get('modulo/:moduloId/progresso')
    getProgresso(@Param('moduloId') moduloId: string, @Req() request: Request) {
        const token = request.get('Authorization');

        return this.aulaService.getProgresso(+moduloId, token);
    }

    @ApiOperation({
        summary: 'Progresso do módulo',
        description: 'Progresso do módulo',
    })
    @ApiTags('Aula')
    @Get('modulo/:moduloId/progresso/resume')
    getProgressoResume(
        @Param('moduloId') moduloId: string,
        @Req() request: Request,
    ) {
        const token = request.get('Authorization');

        return this.aulaService.getProgressoResume(+moduloId, token);
    }
}
