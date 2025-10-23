import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationNotFoundException } from '../errors/notification.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async findOneById(id: number): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOneById(id);
    if (!notification) {
      throw new NotificationNotFoundException();
    }
    return notification;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<NotificationEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.notificationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const notification = await this.notificationRepository.findOne(
      queryOptions as FindOneOptions<NotificationEntity>,
    );
    return notification;
  }

  async findAll(query: IQueryObject): Promise<NotificationEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.notificationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const profiles = await this.notificationRepository.findAll(
      queryOptions as FindManyOptions<NotificationEntity>,
    );
    return profiles;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<NotificationEntity>> {
    const queryBuilder = new QueryBuilder(
      this.notificationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.notificationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.notificationRepository.findAll(
      queryOptions as FindManyOptions<NotificationEntity>,
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
    notificationEntity: Partial<NotificationEntity>,
  ): Promise<NotificationEntity> {
    return await this.notificationRepository.save(notificationEntity);
  }

  @Transactional()
  async saveMany(
    notificationEntities: Partial<NotificationEntity>[],
  ): Promise<NotificationEntity[]> {
    return Promise.all(notificationEntities.map((dto) => this.save(dto)));
  }

  @Transactional()
  async update(
    id: number,
    notificationEntity: Partial<NotificationEntity>,
  ): Promise<NotificationEntity | null> {
    return this.notificationRepository.update(id, notificationEntity);
  }

  async softDelete(id: number): Promise<NotificationEntity | null> {
    return this.notificationRepository.softDelete(id);
  }

  async delete(id: number): Promise<NotificationEntity | null> {
    const notification = await this.notificationRepository.findOneById(id);
    if (!notification) {
      throw new NotificationNotFoundException();
    }
    return this.notificationRepository.remove(notification);
  }

  //Extended Methods ===========================================================================

  async findAllPaginatedByUser(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<NotificationEntity>> {
    const queryBuilder = new QueryBuilder(
      this.notificationRepository.getMetadata(),
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = {
      ...(queryOptions.where || {}),
      userId,
    };

    const count = await this.notificationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.notificationRepository.findAll(
      queryOptions as FindManyOptions<NotificationEntity>,
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
}
