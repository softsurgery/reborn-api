import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { ConfigurationParamEntity } from '../entities/configuration-param.entity';

@Injectable()
export class ConfigurationParamRepository extends DatabaseAbstractRepository<ConfigurationParamEntity> {
  constructor(
    @InjectRepository(ConfigurationParamEntity)
    private readonly configurationParamRepository: Repository<ConfigurationParamEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(configurationParamRepository, txHost);
  }
}
