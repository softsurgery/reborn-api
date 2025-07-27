import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { DeviceInfoEntity } from '../entities/device-info.entity';

@Injectable()
export class DeviceInfoRepository extends DatabaseAbstractRepository<DeviceInfoEntity> {
  constructor(
    @InjectRepository(DeviceInfoEntity)
    private readonly deviceInfoRepository: Repository<DeviceInfoEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(deviceInfoRepository, txHost);
  }
}
