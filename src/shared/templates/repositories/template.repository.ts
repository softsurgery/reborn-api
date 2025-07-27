import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { TemplateEntity } from '../entities/template.entity';

@Injectable()
export class TemplateRepository extends DatabaseAbstractRepository<TemplateEntity> {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(templateRepository, txHost);
  }
}
