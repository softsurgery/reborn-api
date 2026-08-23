import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { MessageUploadEntity } from '../entities/message-upload.entity';

@Injectable()
export class MessageUploadRepository extends DatabaseAbstractRepository<MessageUploadEntity> {
  constructor(
    @InjectRepository(MessageUploadEntity)
    private readonly messageUploadRepository: Repository<MessageUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(messageUploadRepository, txHost);
  }
}
