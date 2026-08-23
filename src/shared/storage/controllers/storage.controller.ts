import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { StorageService } from '../services/storage.service';
import { StorageEntity } from '../entities/storage.entity';
import { Public } from 'src/shared/auth/utils/public-strategy';

@ApiTags('storage')
@ApiBearerAuth('access_token')
@Controller({
  version: '1',
  path: '/storage',
})
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get('/resource/:slug')
  async viewResourceBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findBySlug(slug);
    if (upload.isPrivate) {
      throw new UnauthorizedException(
        'You do not have permission to access this file',
      );
    }

    await this.streamResource(req, res, upload, false);
  }

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
    @Query('folderId') folderId?: string,
  ): Promise<StorageEntity[]> {
    return this.storageService.storeMultipleFiles(
      files,
      false,
      true,
      folderId ? Number(folderId) : undefined,
    );
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
    @Query('folderId') folderId?: string,
  ): Promise<StorageEntity[]> {
    return this.storageService.storeMultipleFiles(
      files,
      true,
      true,
      folderId ? Number(folderId) : undefined,
    );
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
    @Body('filename') filename?: string,
    @Query('folderId') folderId?: string,
  ): Promise<StorageEntity> {
    if (filename?.trim()) {
      file.originalname = filename.trim();
    }
    return this.storageService.store(
      file,
      false,
      true,
      undefined,
      folderId ? Number(folderId) : undefined,
    );
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
    @Body('filename') filename?: string,
    @Query('folderId') folderId?: string,
  ): Promise<StorageEntity> {
    if (filename?.trim()) {
      file.originalname = filename.trim();
    }
    return this.storageService.store(
      file,
      true,
      true,
      undefined,
      folderId ? Number(folderId) : undefined,
    );
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
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findBySlug(slug);

    await this.streamResource(req, res, upload, true);
  }

  @Get('/view/id/:id')
  async viewFileById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const upload = await this.storageService.findOneById(id);

    await this.streamResource(req, res, upload, true);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<StorageEntity> {
    return this.storageService.delete(id);
  }

  @Delete('slug/:slug')
  async deleteBySlug(@Param('slug') slug: string): Promise<StorageEntity> {
    return this.storageService.deleteBySlug(slug);
  }

  private async streamResource(
    req: Request,
    res: Response,
    upload: StorageEntity,
    useCache: boolean = false,
  ) {
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : upload.size - 1;

      if (start >= upload.size) {
        res
          .status(416)
          .send(
            'Requested range not satisfiable\n' + start + ' >= ' + upload.size,
          );
        return;
      }

      const chunksize = end - start + 1;
      const fileStream = await this.storageService.loadResource(
        upload.slug,
        start,
        end,
      );

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${upload.size}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunksize);
      res.setHeader('Content-Type', upload.mimetype);
      if (useCache) {
        res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
      }
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${upload.filename}"`,
      );
      fileStream.pipe(res);
    } else {
      const fileStream = await this.storageService.loadResource(upload.slug);
      res.setHeader('Content-Type', upload.mimetype);
      res.setHeader('Content-Length', upload.size);
      res.setHeader('Accept-Ranges', 'bytes');
      if (useCache) {
        res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
      }
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${upload.filename}"`,
      );
      fileStream.pipe(res);
    }
  }
}
