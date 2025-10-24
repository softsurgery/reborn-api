import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { MessageRepository } from '../repositories/message.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageNotFoundException } from '../errors/message/message.notfound.error';
import { CreateMessageDto } from '../dtos/message/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async findOneById(id: number): Promise<MessageEntity> {
    const message = await this.messageRepository.findOneById(id);
    if (!message) throw new MessageNotFoundException();
    return message;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<MessageEntity | null> {
    const queryBuilder = new QueryBuilder(this.messageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.messageRepository.findOne(
      queryOptions as FindOneOptions<MessageEntity>,
    );
  }

  async findAll(query: IQueryObject): Promise<MessageEntity[]> {
    const queryBuilder = new QueryBuilder(this.messageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return await this.messageRepository.findAll(
      queryOptions as FindManyOptions<MessageEntity>,
    );
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<MessageEntity>> {
    const queryBuilder = new QueryBuilder(this.messageRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);

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

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(
    createMessageDto: CreateMessageDto,
    userId?: string,
  ): Promise<MessageEntity> {
    return await this.messageRepository.save({ ...createMessageDto, userId });
  }

  @Transactional()
  async saveMany(
    createMessageDto: CreateMessageDto[],
  ): Promise<MessageEntity[]> {
    return Promise.all(createMessageDto.map((dto) => this.save(dto)));
  }

  async softDelete(id: number): Promise<MessageEntity | null> {
    return this.messageRepository.softDelete(id);
  }

  async delete(id: number): Promise<MessageEntity | null> {
    const message = await this.messageRepository.findOneById(id);
    if (!message) throw new MessageNotFoundException();
    return this.messageRepository.remove(message);
  }

  // 🔹 Récupère les messages d’une conversation avec tri décroissant (dernier message en premier)
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
}
