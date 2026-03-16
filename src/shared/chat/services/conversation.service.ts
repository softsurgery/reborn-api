import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { ConversationRepository } from '../repositories/conversation.repository';
import { ConversationEntity } from '../entities/conversation.entity';
import { CreateConversationDto } from '../dtos/conversation/create-conversation.dto';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { UserService } from 'src/modules/users/services/user.service';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { MessageService } from './message.service';

@Injectable()
export class ConversationService extends AbstractCrudService<ConversationEntity> {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {
    super(conversationRepository);
  }

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

    // Fetch last message for each conversation
    await this.populateLastMessages(entities);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  private async populateLastMessages(
    conversations: ConversationEntity[],
  ): Promise<void> {
    if (conversations.length === 0) return;

    await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage =
          await this.messageService.findConversationLastMessage(
            conversation.id,
          );
        if (lastMessage) {
          conversation.messages = [lastMessage];
        } else {
          conversation.messages = [];
        }
      }),
    );
  }

  @Transactional()
  async createConversation(
    targetUserId: string,
    userId?: string,
    duplicateCheck = true,
  ): Promise<ConversationEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const user = await this.userService.findOneById(userId);
    const targetUser = await this.userService.findOneById(targetUserId);
    if (!targetUser) {
      throw new UserNotFoundException();
    }

    const existingConversation = await this.findConversationByUsers([
      userId,
      targetUserId,
    ]);

    if (duplicateCheck && existingConversation) return existingConversation;

    const conversation = new ConversationEntity();
    conversation.participants = [user, targetUser];
    return this.conversationRepository.save(conversation);
  }

  @Transactional()
  async createGroupedConversation(
    createConversationDto: CreateConversationDto,
    userId?: string,
  ): Promise<ConversationEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const user = await this.userService.findOneById(userId);
    const targets: AbstractUserEntity[] = [];
    for (const targetUserId of createConversationDto.users) {
      const targetUser = await this.userService.findOneById(targetUserId);
      if (!targetUser) {
        throw new UserNotFoundException();
      }
      targets.push(targetUser);
    }

    const conversation = new ConversationEntity();
    conversation.participants = [user, ...targets];
    return this.conversationRepository.save(conversation);
  }

  async findConversationByUsers(
    userIds: string[],
  ): Promise<ConversationEntity | null> {
    return this.conversationRepository
      .getUsersConversations(userIds)
      .then((conversations) => {
        return conversations.length > 0 ? conversations[0] : null;
      });
  }
}
