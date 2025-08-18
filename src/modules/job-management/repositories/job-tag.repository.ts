import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobTagEntity } from '../entities/job-tag.entity';

@Injectable()
export class JobTagRepository extends DatabaseAbstractRepository<JobTagEntity> {
  constructor(
    @InjectRepository(JobTagEntity)
    private readonly jobTagRepository: Repository<JobTagEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobTagRepository, txHost);
  }
}
