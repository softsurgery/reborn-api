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
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { StorageService } from '../services/storage.service';
import { StorageEntity } from '../entities/storage.entity';

@ApiTags('storage')
@ApiBearerAuth('access_token')
@Controller({
  version: '1',
  path: '/storage',
})
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/list')
  @ApiPaginatedResponse(StorageEntity)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<StorageEntity>> {
    return this.storageService.findAllPaginated(query);
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<StorageEntity[]> {
    return await this.storageService.findAll(options);
  }

  @Get(':id')
  async getFileByIdOrSlug(@Param('id') id: number): Promise<StorageEntity> {
    return this.storageService.findOneById(id);
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
  ): Promise<StorageEntity[]> {
    return this.storageService.storeMultipleFiles(files);
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
  ): Promise<StorageEntity[]> {
    return this.storageService.storeMultipleFiles(files, true);
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
  ): Promise<StorageEntity> {
    return this.storageService.store(file);
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
  ): Promise<StorageEntity> {
    return this.storageService.store(file, true);
  }

  @Get('/download/slug/:slug')
  async downloadFileBySlug(
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findBySlug(slug);
    const fileStream = await this.storageService.loadResource(slug);
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
    const upload = await this.storageService.findOneById(id);
    const fileStream = await this.storageService.loadResource(upload.slug);
    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Length', upload.size);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${upload.filename}"`,
    );
    fileStream.pipe(res);
  }

  @Get('/view/slug/:slug')
  async viewFileBySlug(
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findBySlug(slug);
    const fileStream = await this.storageService.loadResource(slug);

    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Length', upload.size);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${upload.filename}"`,
    );

    fileStream.pipe(res);
  }

  @Get('/view/id/:id')
  async viewFileById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findOneById(id);
    const fileStream = await this.storageService.loadResource(upload.slug);

    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Length', upload.size);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${upload.filename}"`,
    );

    fileStream.pipe(res);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<StorageEntity> {
    return this.storageService.delete(id);
  }

  @Delete('slug/:slug')
  async deleteBySlug(@Param('slug') slug: string): Promise<StorageEntity> {
    return this.storageService.deleteBySlug(slug);
  }
}
