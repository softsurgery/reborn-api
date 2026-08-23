import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { MessageLinkEntity } from '../entities/message-link.entity';

@Injectable()
export class MessageLinkRepository extends DatabaseAbstractRepository<MessageLinkEntity> {
  constructor(
    @InjectRepository(MessageLinkEntity)
    private readonly messageLinkRepository: Repository<MessageLinkEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(messageLinkRepository, txHost);
  }
}
