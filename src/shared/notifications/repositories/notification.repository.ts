import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends DatabaseAbstractRepository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(notificationRepository, txHost);
  }
}
