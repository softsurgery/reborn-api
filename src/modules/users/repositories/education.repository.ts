import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { EducationEntity } from '../entities/education.entity';

@Injectable()
export class EducationRepository extends DatabaseAbstractRepository<EducationEntity> {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(educationRepository, txHost);
  }
}
