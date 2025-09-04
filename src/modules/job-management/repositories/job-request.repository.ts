import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobRequestEntity } from '../entities/job-request.entity';

@Injectable()
export class JobRequestRepository extends DatabaseAbstractRepository<JobRequestEntity> {
  constructor(
    @InjectRepository(JobRequestEntity)
    private readonly jobRequestRepository: Repository<JobRequestEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobRequestRepository, txHost);
  }
}
