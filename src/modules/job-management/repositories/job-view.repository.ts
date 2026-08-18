import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { JobViewEntity } from '../entities/job-view.entity';

@Injectable()
export class JobViewRepository extends DatabaseAbstractRepository<JobViewEntity> {
  constructor(
    @InjectRepository(JobViewEntity)
    private readonly jobViewRepository: Repository<JobViewEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(jobViewRepository, txHost);
  }

  getSearchFields(): string[] {
    return this.getMetadata()
      .relations.filter((relation) => relation.isManyToOne)
      .filter((relation) =>
        relation.inverseEntityMetadata.columns.some(
          (column) => column.propertyName === 'title',
        ),
      )
      .flatMap((relation) =>
        this.getRelationSearchFields(relation.propertyName),
      );
  }
}
