import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { TemplateRepository } from '../repositories/template.repository';
import { TemplateEntity } from '../entities/template.entity';
import { TemplateNotFoundException } from '../errors/template.notfound.error';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository) {}

  async findOneById(id: string): Promise<TemplateEntity> {
    const template = await this.templateRepository.findOneById(id);
    if (!template) {
      throw new TemplateNotFoundException();
    }
    return template;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<TemplateEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.templateRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const template = await this.templateRepository.findOne(
      queryOptions as FindOneOptions<TemplateEntity>,
    );
    if (!template) return null;
    return template;
  }

  async findAll(query: IQueryObject): Promise<TemplateEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.templateRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    return await this.templateRepository.findAll(
      queryOptions as FindManyOptions<TemplateEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<TemplateEntity>> {
    const queryBuilder = new QueryBuilder(
      this.templateRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.templateRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.templateRepository.findAll(
      queryOptions as FindManyOptions<TemplateEntity>,
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
  async save(template: Partial<TemplateEntity>): Promise<TemplateEntity> {
    const existingTemplate = await this.findOneByName(template.name);

    if (existingTemplate) {
      Object.assign(existingTemplate, template);
      return this.templateRepository.save(existingTemplate);
    }

    const templateInstance = this.templateRepository.create(template);
    return await this.templateRepository.save(templateInstance);
  }

  async saveMany(
    templates: Partial<TemplateEntity>[],
  ): Promise<TemplateEntity[]> {
    return this.templateRepository.saveMany(templates);
  }

  async softDelete(id: string): Promise<TemplateEntity | null> {
    return this.templateRepository.softDelete(id);
  }

  async delete(id: string): Promise<TemplateEntity | null> {
    const template = await this.findOneById(id);
    return this.templateRepository.remove(template);
  }

  //Extended Methods ===========================================================================

  async findOneByName(name?: string): Promise<TemplateEntity | null> {
    return this.templateRepository.findOne({
      where: { name },
      relations: ['styles'],
    });
  }
}
