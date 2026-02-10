import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { RolePermissionEntity } from '../entities/role-permission.entity';

@Injectable()
export class RolePermissionRepository extends DatabaseAbstractRepository<RolePermissionEntity> {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(rolePermissionRepository, txHost);
  }
}
