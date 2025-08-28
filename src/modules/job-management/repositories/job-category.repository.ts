import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobCategoryEntity } from '../entities/job-category.entity';

@Injectable()
export class JobCategoryRepository extends DatabaseAbstractRepository<JobCategoryEntity> {
  constructor(
    @InjectRepository(JobCategoryEntity)
    private readonly jobCategoryRepository: Repository<JobCategoryEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobCategoryRepository, txHost);
  }
}
