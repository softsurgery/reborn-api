import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { RoleRepository } from '../repositories/role.repository';
import { RoleNotFoundException } from '../errors/role/role.notfound.error';
import { CreateRoleDto } from '../dtos/role/create-role.dto';
import { RoleAlreadyExistsException } from '../errors/role/role.alreadyexists.error';
import { RolePermissionService } from './role-permission.service';
import { UpdateRoleDto } from '../dtos/role/update-role.dto';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { CreateRolePermissionDto } from '../dtos/role-permission/create-role-permission.dto';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  async findOneById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new RoleNotFoundException();
    }
    return role;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<RoleEntity | null> {
    const queryBuilder = new QueryBuilder(this.roleRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const role = await this.roleRepository.findOne(
      queryOptions as FindOneOptions<RoleEntity>,
    );
    return role;
  }

  async findAll(query: IQueryObject): Promise<RoleEntity[]> {
    const queryBuilder = new QueryBuilder(this.roleRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const roles = await this.roleRepository.findAll(
      queryOptions as FindManyOptions<RoleEntity>,
    );
    return roles;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<RoleEntity>> {
    const queryBuilder = new QueryBuilder(this.roleRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.roleRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.roleRepository.findAll(
      queryOptions as FindManyOptions<RoleEntity>,
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
  async save(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return await this.roleRepository.save(createRoleDto);
  }

  @Transactional()
  async saveMany(createRoleDto: CreateRoleDto[]): Promise<RoleEntity[]> {
    return Promise.all(createRoleDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity | null> {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async softDelete(id: string): Promise<RoleEntity | null> {
    return this.roleRepository.softDelete(id);
  }

  async delete(id: string): Promise<RoleEntity | null> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new RoleNotFoundException();
    }
    return this.roleRepository.remove(role);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async saveWithPermissions(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { permissions, ...rest } = createRoleDto;
    const existingRole = await this.roleRepository.findOne({
      where: { label: createRoleDto.label },
    });
    if (existingRole) {
      throw new RoleAlreadyExistsException();
    }
    const role = await this.roleRepository.save(rest);
    await this.rolePermissionService.saveMany(
      permissions.map((p) => ({
        roleId: role.id,
        permissionId: p.permissionId,
      })),
    );
    return role;
  }

  @Transactional()
  async saveManyWithPermissions(
    createRoleDtos: CreateRoleDto[],
  ): Promise<RoleEntity[]> {
    return Promise.all(
      createRoleDtos.map((dto) => this.saveWithPermissions(dto)),
    );
  }

  @Transactional()
  async updateWithPermissions(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity | null> {
    const { permissions, ...rest } = updateRoleDto;
    await this.roleRepository.update(id, rest);

    const updatedRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!updatedRole) {
      throw new RoleNotFoundException();
    }

    const existingPermissions = updatedRole?.permissions?.map(
      (p: RolePermissionEntity) => {
        return {
          id: p.id,
          permissionId: p.permissionId,
          roleId: p.roleId,
        };
      },
    );

    await this.roleRepository.updateAssociations<
      Pick<RolePermissionEntity, 'id' | 'permissionId' | 'roleId'>
    >({
      existingItems: existingPermissions || [],
      updatedItems: permissions?.map((permission) => ({
        id: permission.id,
        permissionId: permission.permissionId,
        roleId: updatedRole?.id,
      })),
      keys: ['permissionId', 'roleId'],
      onDelete: async (id: string) => {
        return this.rolePermissionService.softDelete(id);
      },
      onCreate: async (p: CreateRolePermissionDto) => {
        return this.rolePermissionService.save({
          roleId: updatedRole?.id,
          permissionId: p.permissionId,
        });
      },
    });

    return updatedRole;
  }

  @Transactional()
  async duplicateWithPermissions(id: string): Promise<RoleEntity | null> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new RoleNotFoundException();
    }
    return this.saveWithPermissions({
      label: `${role.label} copy`,
      description: role.description,
      permissions: role.permissions.map((p) => ({
        permissionId: p.permissionId,
      })),
    });
  }
}
