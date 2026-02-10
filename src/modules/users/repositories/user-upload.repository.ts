import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { UserUploadEntity } from '../entities/user-upload.entity';

@Injectable()
export class UserUploadRepository extends DatabaseAbstractRepository<UserUploadEntity> {
  constructor(
    @InjectRepository(UserUploadEntity)
    private readonly userUploadRepository: Repository<UserUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(userUploadRepository, txHost);
  }
}
