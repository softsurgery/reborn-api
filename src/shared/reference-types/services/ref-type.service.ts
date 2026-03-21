import { Injectable } from '@nestjs/common';
import { RefTypeRepository } from '../repositories/ref-type.repository';
import { RefTypeEntity } from '../entities/ref-type.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class RefTypeService extends AbstractCrudService<RefTypeEntity> {
  constructor(private readonly refTypeRepository: RefTypeRepository) {
    super(refTypeRepository);
  }

  async findByLabel(label: string): Promise<RefTypeEntity | null> {
    return this.refTypeRepository.findOne({ where: { label } });
  }
}
