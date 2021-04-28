import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UploadedFileMetadata } from '@nestjs/azure-storage';

import { AulaMaterialService } from '../services/aula.material.service';

import { CreateAulaMaterialDto } from '../dto/material/create-aula-material.dto';

import { UpdateAulaMaterialDto } from '../dto/material/update-aula-material.dto';

import { QueryAulaMaterialDto } from '../dto/material/query-aula-material.dto';

@Controller('api/aula/material')
export class AulaMaterialController {
    constructor(private readonly aulaMaterialService: AulaMaterialService) {}

    @ApiOperation({
        summary: 'Listar materials',
        description: 'Listar materials',
    })
    @ApiTags('Material')
    @Get()
    findAll(@Query() query: QueryAulaMaterialDto) {
        return this.aulaMaterialService.findAll(query);
    }

    @ApiOperation({
        summary: 'Encontrar material por id',
        description: 'Encontrar material por id',
    })
    @ApiTags('Material')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.aulaMaterialService.findOne(+id);
    }

    @ApiOperation({
        summary: 'Adicionar aula com material',
        description: 'Adicionar aula com material',
    })
    @ApiTags('Material')
    @ApiConsumes('multipart/form-data')
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 },
            { name: 'download' },
        ]),
    )
    create(
        @UploadedFiles() files: UploadedFileMetadata,
        @Body() createAulaMaterialDto: CreateAulaMaterialDto,
    ) {
        return this.aulaMaterialService.create(createAulaMaterialDto, files);
    }

    @ApiOperation({
        summary: 'Editar material',
        description: 'Editar material',
    })
    @ApiTags('Material')
    @ApiConsumes('multipart/form-data')
    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 },
            { name: 'download' },
        ]),
    )
    update(
        @Param('id') id: string,
        @UploadedFiles() files: UploadedFileMetadata,
        @Body() updateAulaMaterialDto: UpdateAulaMaterialDto,
    ) {
        return this.aulaMaterialService.update(
            +id,
            updateAulaMaterialDto,
            files,
        );
    }

    @ApiOperation({
        summary: 'Deletar material',
        description: 'Deletar material',
    })
    @ApiTags('Material')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.aulaMaterialService.remove(+id);
    }
}
