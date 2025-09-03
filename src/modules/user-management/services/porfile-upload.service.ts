import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { ProfileUploadRepository } from '../repositories/profile-upload.repository';
import { ProfileUploadEntity } from '../entities/profile-upload.entity';
import { ProfileUploadNotFoundException } from '../errors/profile-upload/profile-upload.notfound.error';
import { CreateProfileUploadDto } from '../dtos/profile-upload/create-profile-upload.dto';
import { UploadService } from 'src/shared/uploads/services/upload.service';
import { UpdateProfileUploadDto } from '../dtos/profile-upload/update-profile-upload.dto';

@Injectable()
export class ProfileUploadService {
  constructor(
    private readonly profileUploadRepository: ProfileUploadRepository,
    private readonly uploadService: UploadService,
  ) {}

  async findOneById(id: number): Promise<ProfileUploadEntity> {
    const ProfileUpload = await this.profileUploadRepository.findOneById(id);
    if (!ProfileUpload) {
      throw new ProfileUploadNotFoundException();
    }
    return ProfileUpload;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ProfileUploadEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.profileUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const ProfileUpload = await this.profileUploadRepository.findOne(
      queryOptions as FindOneOptions<ProfileUploadEntity>,
    );
    if (!ProfileUpload) return null;
    return ProfileUpload;
  }

  async findAll(query: IQueryObject): Promise<ProfileUploadEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.profileUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.profileUploadRepository.findAll(
      queryOptions as FindManyOptions<ProfileUploadEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ProfileUploadEntity>> {
    const queryBuilder = new QueryBuilder(
      this.profileUploadRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.profileUploadRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.profileUploadRepository.findAll(
      queryOptions as FindManyOptions<ProfileUploadEntity>,
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
  async save(createProfileUploadDto: CreateProfileUploadDto) {
    if (createProfileUploadDto.uploadId)
      await this.uploadService.confirm(createProfileUploadDto.uploadId);
    return this.profileUploadRepository.save(createProfileUploadDto);
  }

  async saveMany(createProfileUploadDto: CreateProfileUploadDto[]) {
    await Promise.all(
      createProfileUploadDto.map(async (dto) => {
        if (dto.uploadId) await this.uploadService.confirm(dto.uploadId);
      }),
    );
    return this.profileUploadRepository.saveMany(createProfileUploadDto);
  }

  async update(
    id: number,
    updateProfileUploadDto: UpdateProfileUploadDto,
  ): Promise<ProfileUploadEntity | null> {
    return this.profileUploadRepository.update(id, updateProfileUploadDto);
  }

  async softDelete(id: number): Promise<ProfileUploadEntity | null> {
    return this.profileUploadRepository.softDelete(id);
  }

  async delete(id: number): Promise<ProfileUploadEntity | null> {
    const ProfileUpload = await this.findOneById(id);
    return this.profileUploadRepository.remove(ProfileUpload);
  }
}
