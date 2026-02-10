import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ExperienceEntity } from '../entities/experience.entity';

@Injectable()
export class ExperienceRepository extends DatabaseAbstractRepository<ExperienceEntity> {
  constructor(
    @InjectRepository(ExperienceEntity)
    private readonly experienceRepository: Repository<ExperienceEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(experienceRepository, txHost);
  }
}
