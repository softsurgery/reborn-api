import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, IsNull } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class NotificationService extends AbstractCrudService<NotificationEntity> {
  constructor(private readonly notificationRepository: NotificationRepository) {
    super(notificationRepository);
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

  async getUnreadCount(userId?: string): Promise<number> {
    if (!userId) {
      return 0;
    }

    return this.notificationRepository.getTotalCount({
      where: {
        userId,
        readAt: IsNull(),
      },
    });
  }

  @Transactional()
  async markAllAsRead(userId?: string): Promise<void> {
    if (!userId) {
      return;
    }

    await this.notificationRepository
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({ readAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('readAt IS NULL')
      .execute();
  }

  async softDeleteByUserId(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .softDelete()
      .where('userId = :userId', { userId })
      .execute();
  }
}
