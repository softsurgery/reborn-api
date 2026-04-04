import { Injectable } from '@nestjs/common';
import { RefTypeRepository } from '../repositories/ref-type.repository';
import { RefTypeEntity } from '../entities/ref-type.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class RefTypeService extends AbstractCrudService<RefTypeEntity> {
  constructor(private readonly refTypeRepository: RefTypeRepository) {
    super(refTypeRepository);
  }
  async save(dto: DeepPartial<RefTypeEntity>): Promise<RefTypeEntity> {
    if (!dto.id) {
      dto.id = dto.label?.toLowerCase().replace(/\s+/g, '-') || '';
    }
    return this.refTypeRepository.save(dto);
  }

  async findByLabel(label: string): Promise<RefTypeEntity | null> {
    return this.refTypeRepository.findOne({ where: { label } });
  }
}
