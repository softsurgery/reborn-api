import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { BugRepository } from '../repositories/bug.repository';
import { DeviceInfoService } from './device-info.service';
import { BugNotFoundException } from '../errors/bug/bug.notfound.error';
import { BugEntity } from '../entities/bug.entity';
import { CreateBugDto } from '../dtos/bug/create-bug.dto';
import { DeviceInfoEntity } from '../entities/device-info.entity';

@Injectable()
export class BugService {
  constructor(
    private readonly bugRepository: BugRepository,
    private readonly deviceInfoService: DeviceInfoService,
  ) {}

  async findOneById(id: string): Promise<BugEntity> {
    const bug = await this.bugRepository.findOneById(id);
    if (!bug) {
      throw new BugNotFoundException();
    }
    return bug;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<BugEntity | null> {
    const queryBuilder = new QueryBuilder(this.bugRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const bug = await this.bugRepository.findOne(
      queryOptions as FindOneOptions<BugEntity>,
    );
    return bug;
  }

  async findAll(query: IQueryObject): Promise<BugEntity[]> {
    const queryBuilder = new QueryBuilder(this.bugRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const bugs = await this.bugRepository.findAll(
      queryOptions as FindManyOptions<BugEntity>,
    );
    return bugs;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<BugEntity>> {
    const queryBuilder = new QueryBuilder(this.bugRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.bugRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.bugRepository.findAll(
      queryOptions as FindManyOptions<BugEntity>,
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
  async save(createBugDto: CreateBugDto): Promise<BugEntity> {
    return await this.bugRepository.save(createBugDto);
  }

  @Transactional()
  async saveMany(createBugDtos: CreateBugDto[]): Promise<BugEntity[]> {
    return Promise.all(createBugDtos.map((dto) => this.save(dto)));
  }

  async softDelete(id: string): Promise<BugEntity | null> {
    return this.bugRepository.softDelete(id);
  }

  async delete(id: string): Promise<BugEntity | null> {
    const bug = await this.bugRepository.findOneById(id);
    if (!bug) {
      throw new BugNotFoundException();
    }
    return this.bugRepository.remove(bug);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async saveWithDeviceInfo(
    createBugDto: CreateBugDto,
    userId?: string,
  ): Promise<BugEntity> {
    const { device, ...rest } = createBugDto;
    let existingDevice: DeviceInfoEntity | undefined = undefined;
    if (device) {
      existingDevice = await this.deviceInfoService.upsert(device);
    }
    return this.bugRepository.save({
      ...rest,
      deviceId: existingDevice?.id,
      userId,
    });
  }
}
