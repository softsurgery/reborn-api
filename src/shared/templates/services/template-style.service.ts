import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { TemplateStyleRepository } from '../repositories/template-style.repository';
import { TemplateStyleEntity } from '../entities/template-style.entity';
import { TemplateStyleNotFoundException } from '../errors/template-style.notfound.error';

@Injectable()
export class TemplateStyleService {
  constructor(
    private readonly templateStyleRepository: TemplateStyleRepository,
  ) {}

  async findOneById(id: string): Promise<TemplateStyleEntity> {
    const templateStyle = await this.templateStyleRepository.findOneById(id);
    if (!templateStyle) {
      throw new TemplateStyleNotFoundException();
    }
    return templateStyle;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<TemplateStyleEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.templateStyleRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const templateStyle = await this.templateStyleRepository.findOne(
      queryOptions as FindOneOptions<TemplateStyleEntity>,
    );
    if (!templateStyle) return null;
    return templateStyle;
  }

  async findAll(query: IQueryObject): Promise<TemplateStyleEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.templateStyleRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.templateStyleRepository.findAll(
      queryOptions as FindManyOptions<TemplateStyleEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<TemplateStyleEntity>> {
    const queryBuilder = new QueryBuilder(
      this.templateStyleRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.templateStyleRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.templateStyleRepository.findAll(
      queryOptions as FindManyOptions<TemplateStyleEntity>,
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
  async save(
    style: Partial<TemplateStyleEntity>,
  ): Promise<TemplateStyleEntity> {
    const existingStyle = await this.findOneByName(style.name);
    if (existingStyle) {
      return this.templateStyleRepository.save({
        ...existingStyle,
        ...style,
      });
    }
    return this.templateStyleRepository.save(style);
  }

  async saveMany(
    styles: Partial<TemplateStyleEntity>[],
  ): Promise<TemplateStyleEntity[]> {
    return this.templateStyleRepository.saveMany(styles);
  }

  async softDelete(id: string): Promise<TemplateStyleEntity | null> {
    return this.templateStyleRepository.softDelete(id);
  }

  async delete(id: string): Promise<TemplateStyleEntity | null> {
    const template = await this.findOneById(id);
    return this.templateStyleRepository.remove(template);
  }

  //Extended Methods ===========================================================================

  async findOneByName(name?: string): Promise<TemplateStyleEntity | null> {
    return this.templateStyleRepository.findOne({ where: { name } });
  }
}
