import { Injectable } from '@nestjs/common';
import { RefParamEntity } from '../entities/ref-param.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { RefParamRepository } from '../repositories/ref-param.repository';

@Injectable()
export class RefParamService extends AbstractCrudService<RefParamEntity> {
  constructor(private readonly refParamRepository: RefParamRepository) {
    super(refParamRepository);
  }
}
