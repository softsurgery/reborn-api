import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { RegionRepository } from '../repositories/region.repository';
import { RegionEntity } from '../entities/region.entity';
import { RegionNotFoundException } from '../errors/region.notfound.error';
import { CreateRegionDto } from '../dtos/create-region.dto';
import { UpdateRegionDto } from '../dtos/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private readonly regionRepository: RegionRepository) {}

  async findOneById(id: string): Promise<RegionEntity> {
    const region = await this.regionRepository.findOneById(id);
    if (!region) {
      throw new RegionNotFoundException();
    }
    return region;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<RegionEntity | null> {
    const queryBuilder = new QueryBuilder(this.regionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const region = await this.regionRepository.findOne(
      queryOptions as FindOneOptions<RegionEntity>,
    );
    return region;
  }

  async findAll(query: IQueryObject): Promise<RegionEntity[]> {
    const queryBuilder = new QueryBuilder(this.regionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const regions = await this.regionRepository.findAll(
      queryOptions as FindManyOptions<RegionEntity>,
    );
    return regions;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<RegionEntity>> {
    const queryBuilder = new QueryBuilder(this.regionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.regionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.regionRepository.findAll(
      queryOptions as FindManyOptions<RegionEntity>,
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
  async save(createRegionDto: CreateRegionDto): Promise<RegionEntity> {
    return await this.regionRepository.save(createRegionDto);
  }

  @Transactional()
  async saveMany(createRegionDto: CreateRegionDto[]): Promise<RegionEntity[]> {
    return Promise.all(createRegionDto.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: string,
    updateRegionDto: UpdateRegionDto,
  ): Promise<RegionEntity | null> {
    return this.regionRepository.update(id, updateRegionDto);
  }

  async softDelete(id: string): Promise<RegionEntity | null> {
    return this.regionRepository.softDelete(id);
  }

  async delete(id: string): Promise<RegionEntity | null> {
    const region = await this.regionRepository.findOneById(id);
    if (!region) {
      throw new RegionNotFoundException();
    }
    return this.regionRepository.remove(region);
  }
}
