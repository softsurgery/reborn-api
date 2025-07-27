import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends DatabaseAbstractRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(permissionRepository, txHost);
  }
}
