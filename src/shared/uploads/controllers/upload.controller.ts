import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { UploadEntity } from '../entities/upload.entity';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';

@ApiTags('upload')
@ApiBearerAuth('access_token')
@Controller({
  version: '1',
  path: '/upload',
})
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('/list')
  @ApiPaginatedResponse(UploadEntity)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<UploadEntity>> {
    return this.uploadService.findAllPaginated(query);
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<UploadEntity[]> {
    return await this.uploadService.findAll(options);
  }

  @Get(':id')
  async getFileByIdOrSlug(@Param('id') id: number): Promise<UploadEntity> {
    return this.uploadService.findOneById(id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadEntity[]> {
    return this.uploadService.storeMultipleFiles(files);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/multiple/temporary')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadTemporaryMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadEntity[]> {
    return this.uploadService.storeMultipleFiles(files, true);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadEntity> {
    return this.uploadService.store(file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload/temporary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemporaryFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadEntity> {
    return this.uploadService.store(file, true);
  }

  @Get('/download/slug/:slug')
  async downloadFileBySlug(
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.uploadService.findBySlug(slug);
    const fileStream = await this.uploadService.loadResource(slug);
    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Length', upload.size);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${upload.filename}"`,
    );
    fileStream.pipe(res);
  }

  @Get('download/id/:id')
  async downloadFileById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.uploadService.findOneById(id);
    const fileStream = await this.uploadService.loadResource(upload.slug);
    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Length', upload.size);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${upload.filename}"`,
    );
    fileStream.pipe(res);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<UploadEntity> {
    return this.uploadService.delete(id);
  }

  @Delete('slug/:slug')
  async deleteBySlug(@Param('slug') slug: string): Promise<UploadEntity> {
    return this.uploadService.deleteBySlug(slug);
  }
}
