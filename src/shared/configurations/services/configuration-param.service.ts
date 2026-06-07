import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { Injectable } from '@nestjs/common';
import { ConfigurationParamEntity } from '../entities/configuration-param.entity';
import { ConfigurationParamRepository } from '../repositories/configuration-param.repository';
import { UpdateConfigurationParamaterDto } from '../dtos/paramater/update-configuration-paramater.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { ParamVariant } from '../enums/param-variant.enum';
import { ConfigurationParamaterNotFoundException } from '../errors/paramater/paramater.notfound.error copy';
import { ConfigurationParamaterInvalideValueException } from '../errors/paramater/paramater.invalide.error';

@Injectable()
export class ConfigurationParamService extends AbstractCrudService<ConfigurationParamEntity> {
  constructor(
    private readonly configurationParamRepository: ConfigurationParamRepository,
  ) {
    super(configurationParamRepository);
  }

  static isValidValue(param: ConfigurationParamEntity) {
    switch (param.variant) {
      case ParamVariant.STRING:
        return true;
      case ParamVariant.NUMBER:
        return !isNaN(Number(param.value));
      case ParamVariant.BOOLEAN:
        return param.value === 'true' || param.value === 'false';
      case ParamVariant.SELECT:
        return param.options?.some((option) => option.value === param.value);
      default:
        return false;
    }
  }

  @Transactional()
  async updateBatchParams(
    dtos: UpdateConfigurationParamaterDto[],
  ): Promise<(ConfigurationParamEntity | null)[]> {
    return Promise.all(
      dtos.map(async (dto) => {
        const entity = await this.findOneById(dto.id);

        if (!entity) {
          throw new ConfigurationParamaterNotFoundException();
        }

        if (!ConfigurationParamService.isValidValue(entity)) {
          throw new ConfigurationParamaterInvalideValueException();
        }

        return this.repository.update(dto.id, dto);
      }),
    );
  }
}
