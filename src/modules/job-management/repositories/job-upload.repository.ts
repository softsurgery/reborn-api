import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobUploadEntity } from '../entities/job-upload.entity';

@Injectable()
export class JobUploadRepository extends DatabaseAbstractRepository<JobUploadEntity> {
  constructor(
    @InjectRepository(JobUploadEntity)
    private readonly jobUploadRepository: Repository<JobUploadEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobUploadRepository, txHost);
  }
}
