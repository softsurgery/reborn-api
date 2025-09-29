import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobSaveEntity } from '../entities/job-save.entity';

@Injectable()
export class JobSaveRepository extends DatabaseAbstractRepository<JobSaveEntity> {
  constructor(
    @InjectRepository(JobSaveEntity)
    private readonly jobSaveRepository: Repository<JobSaveEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobSaveRepository, txHost);
  }
}
