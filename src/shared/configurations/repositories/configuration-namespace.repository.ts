import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ConfigurationNamespaceEntity } from '../entities/configuration-namespace.entity';

@Injectable()
export class ConfigurationNamespaceRepository extends DatabaseAbstractRepository<ConfigurationNamespaceEntity> {
  constructor(
    @InjectRepository(ConfigurationNamespaceEntity)
    private readonly configurationNamespaceRepository: Repository<ConfigurationNamespaceEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(configurationNamespaceRepository, txHost);
  }
}
