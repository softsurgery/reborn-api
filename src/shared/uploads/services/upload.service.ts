import { Injectable, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { join } from 'path';
import { createReadStream, promises as fs } from 'fs';
import { constants } from 'fs';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { ConfigService } from '@nestjs/config';
import { UploadRepository } from '../repositories/upload.repository';
import { UploadEntity } from '../entities/upload.entity';
import { UploadNotFoundException } from '../errors/upload.not-found.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { UploadBadRequestException } from '../errors/upload.bad-request.error';
import { FileNotFoundException } from '../errors/file.not-found.error';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UploadService {
  rootLocation: string;
  logger = new Logger(UploadService.name);
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly configService: ConfigService,
  ) {
    this.rootLocation =
      this.configService.get<string>('app.uploadPath') || '/upload';
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<UploadEntity>> {
    const queryBuilder = new QueryBuilder(this.uploadRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.uploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.uploadRepository.findAll(
      queryOptions as FindManyOptions<UploadEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findBySlug(slug: string): Promise<UploadEntity> {
    const upload = await this.uploadRepository.findOne({ where: { slug } });
    if (!upload) {
      throw new UploadNotFoundException();
    }
    return upload;
  }
  async findOneById(id: number): Promise<UploadEntity> {
    const upload = await this.uploadRepository.findOneById(id);
    if (!upload) {
      throw new UploadNotFoundException();
    }
    return upload;
  }

  async findAll(query: IQueryObject = {}): Promise<UploadEntity[]> {
    const queryBuilder = new QueryBuilder(this.uploadRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.uploadRepository.findAll(
      queryOptions as FindManyOptions<UploadEntity>,
    );
  }

  async store(
    file: Express.Multer.File,
    isTemporary = false,
    isPrivate = false,
  ): Promise<UploadEntity> {
    const slug = uuidv4();
    const filename = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;

    const extension = mime.extension(mimetype) || '';
    let relativePath = slug;

    if (extension) {
      relativePath = `${slug}.${extension}`;
    }

    const upload = this.uploadRepository.save({
      slug,
      filename,
      mimetype,
      size,
      relativePath,
      isTemporary,
      isPrivate,
    });

    const destinationFile = join(this.rootLocation, relativePath);
    try {
      if (!file.buffer || file.buffer.length === 0) {
        throw new UploadBadRequestException('Failed to store empty file.');
      }

      await fs.mkdir(this.rootLocation, { recursive: true });
      await fs.writeFile(destinationFile, file.buffer);
    } catch (error) {
      throw new UploadBadRequestException(`Failed to store file : ${error}`);
    }

    return upload;
  }

  async storeMultipleFiles(
    files: Express.Multer.File[],
    isTemporary = false,
    isPrivate = false,
  ) {
    const uploads = await Promise.all(
      files.map(async (file) => {
        return this.store(file, isTemporary, isPrivate);
      }),
    );
    return uploads;
  }

  async expose(id: number): Promise<UploadEntity> {
    const upload = await this.findOneById(id);
    upload.isPrivate = false;
    return await this.uploadRepository.save(upload);
  }

  async hide(id: number): Promise<UploadEntity> {
    const upload = await this.findOneById(id);
    upload.isPrivate = true;
    return await this.uploadRepository.save(upload);
  }

  async confirm(id: number): Promise<UploadEntity> {
    const upload = await this.findOneById(id);
    upload.isTemporary = false;
    return await this.uploadRepository.save(upload);
  }

  async unconfirm(id: number): Promise<UploadEntity> {
    const upload = await this.findOneById(id);
    upload.isTemporary = true;
    return await this.uploadRepository.save(upload);
  }

  async findTemporary(): Promise<UploadEntity[]> {
    const uploads = await this.uploadRepository.findAll({
      where: { isTemporary: true },
    });
    return uploads;
  }

  async loadResource(slug: string): Promise<ReadStream> {
    const upload = await this.findBySlug(slug);
    const filePath = join(this.rootLocation, upload.relativePath);

    try {
      await fs.access(filePath, constants.F_OK);
      return createReadStream(filePath);
    } catch (error) {
      throw new FileNotFoundException(error);
    }
  }

  async duplicate(id: number): Promise<UploadEntity> {
    //Find the original upload entity
    const originalUpload = await this.findOneById(id);

    //Generate a new slug and file path for the duplicate
    const newSlug = uuidv4();
    const originalFilePath = join(
      this.rootLocation,
      originalUpload.relativePath,
    );
    const fileExtension = mime.extension(originalUpload.mimetype) || '';
    let newRelativePath = newSlug;

    if (fileExtension) {
      newRelativePath = `${newSlug}.${fileExtension}`;
    }

    const newFilePath = join(this.rootLocation, newRelativePath);

    //Copy the file on the filesystem
    try {
      await fs.copyFile(originalFilePath, newFilePath);
    } catch (error) {
      throw new UploadBadRequestException(`Failed to duplicate file: ${error}`);
    }

    //Save the duplicated upload entity in the database
    const duplicatedUpload = await this.uploadRepository.save({
      slug: newSlug,
      filename: originalUpload.filename,
      mimetype: originalUpload.mimetype,
      size: originalUpload.size,
      relativePath: newRelativePath,
    });

    return duplicatedUpload;
  }

  async duplicateMany(ids: number[]): Promise<UploadEntity[]> {
    const duplicatedUploads = await Promise.all(
      ids.map((id) => this.duplicate(id)),
    );
    return duplicatedUploads;
  }

  async delete(id: number): Promise<UploadEntity> {
    const upload = await this.findOneById(id);
    const filePath = join(this.rootLocation, upload.relativePath);

    try {
      await fs.unlink(filePath);
      await this.uploadRepository.softDelete(upload.id);
      return upload;
    } catch (error) {
      throw new UploadBadRequestException(
        `Failed to delete file: ${upload.slug} ${error}`,
      );
    }
  }

  async deleteBySlug(slug: string): Promise<UploadEntity> {
    const upload = await this.findBySlug(slug);
    return this.delete(upload.id);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  async getTotal(): Promise<number> {
    return this.uploadRepository.getTotalCount();
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async cleanTemporary(): Promise<void> {
    this.logger.log('Cleaning temporary uploads');
    const uploads = await this.findTemporary();
    await Promise.all(uploads.map((upload) => this.delete(upload.id)));
    if (uploads.length === 0) this.logger.log('No temporary uploads to clean');
    else this.logger.log(`Cleaned ${uploads.length} temporary uploads`);
  }
}
