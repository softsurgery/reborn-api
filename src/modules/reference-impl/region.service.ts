import { Injectable, NotFoundException } from '@nestjs/common';
import { RefParamEntity } from 'src/shared/reference-types/entities/ref-param.entity';
import { RefTypeEntity } from 'src/shared/reference-types/entities/ref-type.entity';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';

@Injectable()
export class RegionService {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  async getRegionParent(): Promise<RefTypeEntity | null> {
    const parent = await this.refTypeRepository.findOne({
      where: { label: 'Region' },
    });
    if (!parent) {
      throw new NotFoundException();
    }
    return parent;
  }

  async getRegionParams(): Promise<RefParamEntity[]> {
    const parent = await this.getRegionParent();
    return this.refParamRepository.findAll({
      where: { refTypeId: parent?.id },
    });
  }
}
