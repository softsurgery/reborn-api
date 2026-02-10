import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { ConversationRepository } from '../repositories/conversation.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationNotFoundException } from '../errors/conversation/conversation.notfound.error';
import { CreateConversationDto } from '../dtos/conversation/create-conversation.dto';
import { ComposeConversationDto } from '../dtos/conversation/compose-conversation.dto';
import { UserService } from 'src/modules/users/services/user.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
  ) {}

  async findOneById(id: number): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.findOneById(id);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    return conversation;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<ConversationEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.conversationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const conversation = await this.conversationRepository.findOne(
      queryOptions as FindOneOptions<ConversationEntity>,
    );
    return conversation;
  }

  async findAll(query: IQueryObject): Promise<ConversationEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.conversationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const conversations = await this.conversationRepository.findAll(
      queryOptions as FindManyOptions<ConversationEntity>,
    );
    return conversations;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ConversationEntity>> {
    const queryBuilder = new QueryBuilder(
      this.conversationRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.conversationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.conversationRepository.findAll(
      queryOptions as FindManyOptions<ConversationEntity>,
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
    createConversationDto: CreateConversationDto,
    userId?: string,
  ): Promise<ConversationEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const connectedUser = await this.userService.findOneById(userId);

    const targetUser = await this.userService.findOneById(
      createConversationDto.targetUserId,
    );

    if (!connectedUser || !targetUser) {
      throw new UserNotFoundException();
    }

    return this.conversationRepository.save({
      participants: [connectedUser, targetUser],
      messages: [],
    });
  }

  @Transactional()
  async saveMany(
    createConversationDto: CreateConversationDto[],
  ): Promise<ConversationEntity[]> {
    return Promise.all(createConversationDto.map((dto) => this.save(dto)));
  }

  async softDelete(id: number): Promise<ConversationEntity | null> {
    return this.conversationRepository.softDelete(id);
  }

  async delete(id: number): Promise<ConversationEntity | null> {
    const conversation = await this.conversationRepository.findOneById(id);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    return this.conversationRepository.remove(conversation);
  }

  //Extended Methods ===========================================================================

  async findPaginatedUserConversations(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<ConversationEntity>> {
    const queryBuilder = new QueryBuilder(
      this.conversationRepository.getMetadata(),
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = {
      ...(queryOptions.where || {}),
      participants: {
        id: userId,
      },
    };

    const count = await this.conversationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.conversationRepository.findAll(
      queryOptions as FindManyOptions<ConversationEntity>,
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

  async findConversationByUsers(userId1: string, userId2: string) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.participants', 'participant')
      .where('participant.id IN (:...userIds)', { userIds: [userId1, userId2] })
      .groupBy('conversation.id')
      .having('COUNT(DISTINCT participant.id) = 2')
      .getOne();
  }

  async composeConversation(composeConversationDto: ComposeConversationDto) {
    const participants = await Promise.all(
      composeConversationDto.participantIds.map(async (participant) => {
        const user = await this.userService.findOneById(participant);

        if (!user) {
          throw new BadRequestException('Participant is required');
        }

        return user;
      }),
    );

    return this.conversationRepository.save({
      participants,
      messages: [],
    });
  }
}
