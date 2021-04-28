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

import { AulaVideoService } from '../services/aula.video.service';

import { UtilService } from '../../utils/utils.service';

import { CreateAulaVideoDto } from '../dto/video/create-aula-video.dto';

import { UpdateAulaVideoDto } from '../dto/video/update-aula-video.dto';

import { QueryAulaVideoDto } from '../dto/video/query-aula-video.dto';

@Controller('api/aula/video')
export class AulaVideoController {
    constructor(
        private readonly aulaVideoService: AulaVideoService,
        private utilService: UtilService,
    ) {}

    @ApiOperation({
        summary: 'Listar vídeos',
        description: 'Listar vídeos',
    })
    @ApiTags('Vídeo')
    @Get()
    findAll(@Query() query: QueryAulaVideoDto) {
        return this.aulaVideoService.findAll(query);
    }

    @ApiOperation({
        summary: 'Encontrar vídeo por id',
        description: 'Encontrar vídeo por id',
    })
    @ApiTags('Vídeo')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aulaVideoService.findOne(+id);
    }

    @ApiOperation({
        summary: 'Adicionar aula com vídeo',
        description: 'Adicionar aula com vídeo',
    })
    @ApiTags('Vídeo')
    @Post()
    create(@Body() createAulaVideoDto: CreateAulaVideoDto) {
        const thumbnail = this.utilService.GetVideoThumbnail(
            createAulaVideoDto.url,
        );

        return this.aulaVideoService.create(createAulaVideoDto, thumbnail);
    }

    @ApiOperation({
        summary: 'Editar vídeo',
        description: 'Editar vídeo',
    })
    @ApiTags('Vídeo')
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateAulaVideoDto: UpdateAulaVideoDto,
    ) {
        const thumbnail = this.utilService.GetVideoThumbnail(
            updateAulaVideoDto.url,
        );

        return this.aulaVideoService.update(+id, updateAulaVideoDto, thumbnail);
    }

    @ApiOperation({
        summary: 'Deletar vídeo',
        description: 'Deletar vídeo',
    })
    @ApiTags('Vídeo')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aulaVideoService.remove(+id);
    }
}
