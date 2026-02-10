import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { StorageRepository } from '../repositories/storage.repository';
import { StorageEntity } from '../entities/storage.entity';
import { StorageBadRequestException } from '../errors/storage.bad-request.error';
import { FileNotFoundException } from '../errors/file.not-found.error';
import { StorageService } from './storage.service';
import { Client as MinioClient } from 'minio';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Injectable()
export class MinioStorageService extends StorageService {
  private minio: MinioClient;
  private bucket: string;

  constructor(
    readonly storageRepository: StorageRepository,
    readonly configService: ConfigService,
  ) {
    super(storageRepository);

    this.bucket = this.configService.get<string>('s3.bucket') || 'uploads';
    this.minio = new MinioClient({
      endPoint: this.configService.get<string>('s3.endpoint') || 'localhost',
      port: this.configService.get<number>('s3.port') || 9000,
      useSSL: this.configService.get<boolean>('s3.useSSL') || false,
      accessKey: this.configService.get<string>('s3.accessKey') || 'minioadmin',
      secretKey: this.configService.get<string>('s3.secretKey') || 'minioadmin',
    });

    void this.ensureBucketExists();
  }

  getStorageType(): string {
    return 'minio';
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minio.bucketExists(this.bucket);
      if (!exists) {
        await this.minio.makeBucket(this.bucket);
        console.log(`Bucket ${this.bucket} created successfully`);
      }
    } catch (err) {
      console.error('Error ensuring bucket exists', err);
      throw err;
    }
  }

  private bufferToStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }

  async loadResource(slug: string): Promise<ReadStream> {
    const upload = await this.findBySlug(slug);

    try {
      const stream = await this.minio.getObject(
        this.bucket,
        upload.relativePath,
      );
      return stream as unknown as ReadStream;
    } catch (error) {
      throw new FileNotFoundException(error);
    }
  }

  async store(
    file: Express.Multer.File,
    isTemporary = false,
    isPrivate = false,
  ): Promise<StorageEntity> {
    const slug = uuidv4();
    const filename = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const extension = mime.extension(mimetype) || '';
    const key = extension ? `${slug}.${extension}` : slug;

    const upload = await this.storageRepository.save({
      slug,
      filename,
      mimetype,
      size,
      relativePath: key,
      isTemporary,
      isPrivate,
    });

    try {
      if (!file.buffer || file.buffer.length === 0) {
        throw new StorageBadRequestException('Failed to store empty file.');
      }

      await this.minio.putObject(
        this.bucket,
        key,
        this.bufferToStream(file.buffer),
        size,
        { 'Content-Type': mimetype },
      );
    } catch (error) {
      throw new StorageBadRequestException(`Failed to store file: ${error}`);
    }

    return upload;
  }

  async delete(id: number): Promise<StorageEntity> {
    const upload = await this.findOneById(id);

    try {
      await this.minio.removeObject(this.bucket, upload.relativePath);
      await this.storageRepository.softDelete(upload.id);
      return upload;
    } catch (error) {
      throw new StorageBadRequestException(
        `Failed to delete file: ${upload.slug} ${error}`,
      );
    }
  }

  // Store multiple files
  async storeMultipleFiles(
    files: Express.Multer.File[],
    isTemporary = false,
    isPrivate = false,
  ): Promise<StorageEntity[]> {
    return Promise.all(
      files.map((file) => this.store(file, isTemporary, isPrivate)),
    );
  }

  // Duplicate many files by IDs
  async duplicateMany(ids: number[]): Promise<StorageEntity[]> {
    return Promise.all(ids.map((id) => this.duplicate(id)));
  }

  // Delete a file by slug
  async deleteBySlug(slug: string): Promise<StorageEntity> {
    const upload = await this.findBySlug(slug);
    return this.delete(upload.id);
  }

  // Delete many files by IDs
  async deleteMany(ids: number[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  async duplicate(id: number): Promise<StorageEntity> {
    const original = await this.findOneById(id);
    const newSlug = uuidv4();
    const extension = mime.extension(original.mimetype) || '';
    const newKey = extension ? `${newSlug}.${extension}` : newSlug;

    try {
      const originalStream = await this.minio.getObject(
        this.bucket,
        original.relativePath,
      );
      const chunks: Buffer[] = [];
      for await (const chunk of originalStream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      await this.minio.putObject(
        this.bucket,
        newKey,
        this.bufferToStream(buffer),
        buffer.length,
        {
          'Content-Type': original.mimetype,
        },
      );
    } catch (err) {
      throw new StorageBadRequestException(`Failed to duplicate file: ${err}`);
    }

    return this.storageRepository.save({
      slug: newSlug,
      filename: original.filename,
      mimetype: original.mimetype,
      size: original.size,
      relativePath: newKey,
    });
  }
}
