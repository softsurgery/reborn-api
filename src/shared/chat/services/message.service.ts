import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { MessageRepository } from '../repositories/message.repository';
import { MessageEntity } from '../entities/message.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class MessageService extends AbstractCrudService<MessageEntity> {
  constructor(private readonly messageRepository: MessageRepository) {
    super(messageRepository);
  }

  @Transactional()
  async saveMessage(
    createMessageDto: Partial<MessageEntity>,
    userId?: string,
  ): Promise<MessageEntity> {
    return await this.messageRepository.save({ ...createMessageDto, userId });
  }

  async findPaginatedConversationMessages(
    query: IQueryObject,
    conversationId?: number,
  ): Promise<PageDto<MessageEntity>> {
    const queryBuilder = new QueryBuilder(this.messageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);

    queryOptions.where = {
      ...(queryOptions.where || {}),
      conversationId,
    };

    const count = await this.messageRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.messageRepository.findAll(
      queryOptions as FindManyOptions<MessageEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities || [], pageMetaDto);
  }

  async findConversationLastMessage(
    conversationId: number,
  ): Promise<MessageEntity | null> {
    const messages = await this.messageRepository.findAll({
      where: {
        conversationId,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    return messages.length > 0 ? messages[0] : null;
  }
}
