import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { UserUploadEntity } from '../entities/user-upload.entity';
import { CreateUserUploadDto } from '../dtos/user-upload/create-user-upload.dto';
import { UpdateUserUploadDto } from '../dtos/user-upload/update-user-upload.dto';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { UserUploadRepository } from '../repositories/user-upload.repository';
import { UserUploadNotFoundException } from '../errors/user-upload/user-upload.notfound.error';

@Injectable()
export class UserUploadService {
  constructor(
    private readonly userUploadRepository: UserUploadRepository,
    private readonly storageService: StorageService,
  ) {}

  async findOneById(id: number): Promise<UserUploadEntity> {
    const ProfileUpload = await this.userUploadRepository.findOneById(id);
    if (!ProfileUpload) {
      throw new UserUploadNotFoundException();
    }
    return ProfileUpload;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<UserUploadEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.userUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const ProfileUpload = await this.userUploadRepository.findOne(
      queryOptions as FindOneOptions<UserUploadEntity>,
    );
    if (!ProfileUpload) return null;
    return ProfileUpload;
  }

  async findAll(query: IQueryObject): Promise<UserUploadEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.userUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.userUploadRepository.findAll(
      queryOptions as FindManyOptions<UserUploadEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<UserUploadEntity>> {
    const queryBuilder = new QueryBuilder(
      this.userUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.userUploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.userUploadRepository.findAll(
      queryOptions as FindManyOptions<UserUploadEntity>,
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

  @Transactional()
  async save(createProfileUploadDto: CreateUserUploadDto) {
    if (createProfileUploadDto.uploadId)
      await this.storageService.confirm(createProfileUploadDto.uploadId);
    return this.userUploadRepository.save(createProfileUploadDto);
  }

  @Transactional()
  async saveMany(createProfileUploadDto: CreateUserUploadDto[]) {
    await Promise.all(
      createProfileUploadDto.map(async (dto) => {
        if (dto.uploadId) await this.storageService.confirm(dto.uploadId);
      }),
    );
    return this.userUploadRepository.saveMany(createProfileUploadDto);
  }

  async update(
    id: number,
    updateProfileUploadDto: UpdateUserUploadDto,
  ): Promise<UserUploadEntity | null> {
    return this.userUploadRepository.update(id, updateProfileUploadDto);
  }

  async softDelete(id: number): Promise<UserUploadEntity | null> {
    return this.userUploadRepository.softDelete(id);
  }

  async delete(id: number): Promise<UserUploadEntity | null> {
    const ProfileUpload = await this.findOneById(id);
    return this.userUploadRepository.remove(ProfileUpload);
  }
}
