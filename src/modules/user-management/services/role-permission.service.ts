import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { RolePermissionNotFoundException } from '../errors/role-permission/role-permission.notfound.error';
import { CreateRolePermissionDto } from '../dtos/role-permission/create-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async findOneById(id: string): Promise<RolePermissionEntity> {
    const rolePermission = await this.rolePermissionRepository.findOneById(id);
    if (!rolePermission) {
      throw new RolePermissionNotFoundException();
    }
    return rolePermission;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<RolePermissionEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.rolePermissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const rolePermission = await this.rolePermissionRepository.findOne(
      queryOptions as FindOneOptions<RolePermissionEntity>,
    );
    if (!rolePermission) return null;
    return rolePermission;
  }

  async findAll(query: IQueryObject): Promise<RolePermissionEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.rolePermissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.rolePermissionRepository.findAll(
      queryOptions as FindManyOptions<RolePermissionEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<RolePermissionEntity>> {
    const queryBuilder = new QueryBuilder(
      this.rolePermissionRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.rolePermissionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.rolePermissionRepository.findAll(
      queryOptions as FindManyOptions<RolePermissionEntity>,
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
  async save(createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionRepository.save(createRolePermissionDto);
  }

  async saveMany(createRolePermissionDto: CreateRolePermissionDto[]) {
    return this.rolePermissionRepository.saveMany(createRolePermissionDto);
  }

  async softDelete(id: string): Promise<RolePermissionEntity | null> {
    return this.rolePermissionRepository.softDelete(id);
  }

  async delete(id: string): Promise<RolePermissionEntity | null> {
    const rolePermission = await this.findOneById(id);
    return this.rolePermissionRepository.remove(rolePermission);
  }
}
