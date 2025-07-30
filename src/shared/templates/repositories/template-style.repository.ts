import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { TemplateStyleEntity } from '../entities/template-style.entity';

@Injectable()
export class TemplateStyleRepository extends DatabaseAbstractRepository<TemplateStyleEntity> {
  constructor(
    @InjectRepository(TemplateStyleEntity)
    private readonly templateStyleRepository: Repository<TemplateStyleEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(templateStyleRepository, txHost);
  }
}
