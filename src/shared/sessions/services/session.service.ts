import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../entities/session.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { SessionRepository } from '../repositories/session.repository';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import {
  FindManyOptions,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { UserService } from 'src/modules/users/services/user.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';

@Injectable()
export class SessionService extends AbstractCrudService<SessionEntity> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userService: UserService,
  ) {
    super(sessionRepository);
  }

  getActiveCondition(extraConditions = {}, userId?: string) {
    const now = new Date();

    const query = [
      {
        ...extraConditions,
        ended: IsNull(),
        started: LessThanOrEqual(now),
        ...(userId && { userId }),
      },
      {
        ...extraConditions,
        ended: IsNull(),
        planned_start: LessThanOrEqual(now),
        planned_end: MoreThanOrEqual(now),
        ...(userId && { userId }),
      },
    ];

    return query;
  }

  async findAllPaginatedActiveUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<SessionEntity>> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = this.getActiveCondition(queryOptions.where, userId);
    const count = await this.sessionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
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

  async findAllPaginatedUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<SessionEntity>> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = { ...queryOptions.where, userId };
    const count = await this.sessionRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
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

  async findAllActiveUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<SessionEntity[]> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return this.sessionRepository.findAll({
      where: this.getActiveCondition(queryOptions, userId),
    });
  }

  async findAllUserSessions(
    query: IQueryObject,
    userId?: string,
  ): Promise<SessionEntity[]> {
    const queryBuilder = new QueryBuilder(this.sessionRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    queryOptions.where = { ...queryOptions.where, userId };
    return this.sessionRepository.findAll(
      queryOptions as FindManyOptions<SessionEntity>,
    );
  }

  async create(
    dto: Partial<SessionEntity>,
    userId?: string,
  ): Promise<SessionEntity> {
    if (!userId) throw new Error('User id is required');
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UserNotFoundException();

    return this.sessionRepository.save({ ...dto, userId });
  }
}
