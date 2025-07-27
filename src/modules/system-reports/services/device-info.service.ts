import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { DeviceInfoRepository } from '../repositories/device-info.repository';
import { DeviceInfoEntity } from '../entities/device-info.entity';
import { DeviceInfoNotFoundException } from '../errors/device-info/device-info.notfound.error';
import { CreateDeviceInfoDto } from '../dtos/device-info/create-device-info.dto';
import { DeviceInfoAlreadyExistsException } from '../errors/device-info/device-info.alreadyexists.error';

@Injectable()
export class DeviceInfoService {
  constructor(private readonly deviceInfoRepository: DeviceInfoRepository) {}

  async findOneById(id: string): Promise<DeviceInfoEntity> {
    const deviceInfo = await this.deviceInfoRepository.findOneById(id);
    if (!deviceInfo) {
      throw new DeviceInfoNotFoundException();
    }
    return deviceInfo;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<DeviceInfoEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.deviceInfoRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const permission = await this.deviceInfoRepository.findOne(
      queryOptions as FindOneOptions<DeviceInfoEntity>,
    );
    if (!permission) return null;
    return permission;
  }

  async findAll(query: IQueryObject = {}): Promise<DeviceInfoEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.deviceInfoRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.deviceInfoRepository.findAll(
      queryOptions as FindManyOptions<DeviceInfoEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<DeviceInfoEntity>> {
    const queryBuilder = new QueryBuilder(
      this.deviceInfoRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.deviceInfoRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.deviceInfoRepository.findAll(
      queryOptions as FindManyOptions<DeviceInfoEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(createDeviceInfoDto: CreateDeviceInfoDto) {
    const existingDeviceInfo = await this.deviceInfoRepository.findOne({
      where: {
        platform: createDeviceInfoDto.platform,
        version: createDeviceInfoDto.version,
        manufacturer: createDeviceInfoDto.manufacturer,
        model: createDeviceInfoDto.model,
      },
    });
    if (existingDeviceInfo) throw new DeviceInfoAlreadyExistsException();
    return this.deviceInfoRepository.save(createDeviceInfoDto);
  }

  async upsert(createDeviceInfoDto: CreateDeviceInfoDto) {
    const existingDeviceInfo = await this.deviceInfoRepository.findOne({
      where: {
        model: createDeviceInfoDto.model,
        platform: createDeviceInfoDto.platform,
        version: createDeviceInfoDto.version,
        manufacturer: createDeviceInfoDto.manufacturer,
      },
    });
    if (existingDeviceInfo) return existingDeviceInfo;
    return this.deviceInfoRepository.save(createDeviceInfoDto);
  }

  async saveMany(createDeviceInfoDto: CreateDeviceInfoDto[]) {
    return this.deviceInfoRepository.saveMany(createDeviceInfoDto);
  }

  async softDelete(id: string): Promise<DeviceInfoEntity | null> {
    return this.deviceInfoRepository.softDelete(id);
  }

  async delete(id: string): Promise<DeviceInfoEntity | null> {
    const permission = await this.findOneById(id);
    return this.deviceInfoRepository.remove(permission);
  }
}
