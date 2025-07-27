import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionEntity } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dtos/permission/create-permission.dto';
import { PermissionNotFoundException } from '../errors/permission/permission.notfound.error';
import { PermissionAlreadyExistsException } from '../errors/permission/permission.alreadyexists.error';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findOneById(id: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOneById(id);
    if (!permission) {
      throw new PermissionNotFoundException();
    }
    return permission;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<PermissionEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.permissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const permission = await this.permissionRepository.findOne(
      queryOptions as FindOneOptions<PermissionEntity>,
    );
    if (!permission) return null;
    return permission;
  }

  async findAll(query: IQueryObject = {}): Promise<PermissionEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.permissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.permissionRepository.findAll(
      queryOptions as FindManyOptions<PermissionEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<PermissionEntity>> {
    const queryBuilder = new QueryBuilder(
      this.permissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.permissionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.permissionRepository.findAll(
      queryOptions as FindManyOptions<PermissionEntity>,
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
  async save(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        label: createPermissionDto.label,
      },
    });
    if (existingPermission) throw new PermissionAlreadyExistsException();
    return this.permissionRepository.save(createPermissionDto);
  }

  async saveMany(createPermissionDto: CreatePermissionDto[]) {
    return this.permissionRepository.saveMany(createPermissionDto);
  }

  async softDelete(id: string): Promise<PermissionEntity | null> {
    return this.permissionRepository.softDelete(id);
  }

  async delete(id: string): Promise<PermissionEntity | null> {
    const permission = await this.findOneById(id);
    return this.permissionRepository.remove(permission);
  }
}
