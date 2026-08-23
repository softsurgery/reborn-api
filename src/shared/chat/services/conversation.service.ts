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
import { MessageService } from './message.service';
import { ConversationNotFoundException } from '../errors/conversation/conversation.notfound.error';
import { ConversationUserEntity } from '../entities/conversation-user.entity';
import { ConversationUserService } from './conversation-user.service';
import { MessageVariant } from '../enums/message-variant.enum';
import { CreateConversationReportDto } from '../dtos/conversation/create-conversation-report.dto';
import { ConversationReportService } from './conversation-report.service';
import { StaticMessageEnum } from 'src/app/enums/static-message.enum';

@Injectable()
export class ConversationService extends AbstractCrudService<ConversationEntity> {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly conversationUserService: ConversationUserService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationReportService: ConversationReportService,
  ) {
    super(conversationRepository);
  }

  async isUserInConversation(
    conversationId: number,
    userId?: string,
  ): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    } as FindManyOptions<ConversationEntity>);

    if (!conversation) return false;
    return conversation.participants.some((p) => p.userId === userId);
  }

  async findPaginatedUserConversations(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<ConversationEntity>> {
    const userConversations =
      await this.conversationUserService.findByUserId(userId);

    const conversationIds = userConversations.map((uc) => uc.conversationId);

    query.filter = query.filter
      ? `${query.filter},id||$in||${conversationIds.join(',')}`
      : `id||$in||${conversationIds.join(',')}`;

    const queryBuilder = new QueryBuilder(
      this.conversationRepository.getMetadata(),
    );

    const queryOptions = queryBuilder.build(query);

    const count = await this.conversationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities: ConversationEntity[] = (
      await this.conversationRepository.findAll(
        queryOptions as FindManyOptions<ConversationEntity>,
      )
    ).sort((a, b) => {
      const aDate = a.lastMessage?.createdAt ?? a.createdAt;
      const bDate = b.lastMessage?.createdAt ?? b.createdAt;

      const aTime = aDate ? new Date(aDate).getTime() : 0;
      const bTime = bDate ? new Date(bDate).getTime() : 0;

      return bTime - aTime;
    });

    // Fetch last message for each conversation

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
  async createConversation(
    targetUserId: string,
    userId?: string,
    duplicateCheck = true,
  ): Promise<ConversationEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const targetUser = await this.userService.findOneById(targetUserId);
    if (!targetUser) {
      throw new UserNotFoundException();
    }

    const existingConversation = await this.findConversationByUsers([
      userId,
      targetUserId,
    ]);

    if (duplicateCheck && existingConversation) return existingConversation;

    const conversation = await this.conversationRepository.save(
      new ConversationEntity(),
    );

    const participantEntries = [userId, targetUserId].map((uid) => {
      const cu = new ConversationUserEntity();
      cu.userId = uid;
      cu.conversationId = conversation.id;
      return cu;
    });
    conversation.participants =
      await this.conversationUserService.saveMany(participantEntries);

    await this.messageService.save({
      conversationId: conversation.id,
      userId,
      variant: MessageVariant.STATIC,
      static: StaticMessageEnum.FIRST_MESSAGE,
    });

    return conversation;
  }

  @Transactional()
  async createGroupedConversation(
    createConversationDto: CreateConversationDto,
    userId?: string,
  ): Promise<ConversationEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    for (const targetUserId of createConversationDto.users) {
      const targetUser = await this.userService.findOneById(targetUserId);
      if (!targetUser) {
        throw new UserNotFoundException();
      }
    }

    const conversation = await this.conversationRepository.save(
      new ConversationEntity(),
    );

    const participantEntries = [userId, ...createConversationDto.users].map(
      (uid) => {
        const cu = new ConversationUserEntity();
        cu.userId = uid;
        cu.conversationId = conversation.id;
        return cu;
      },
    );
    conversation.participants =
      await this.conversationUserService.saveMany(participantEntries);

    return conversation;
  }

  async findConversationByUsers(
    userIds: string[],
  ): Promise<ConversationEntity | null> {
    const conversations =
      await this.conversationRepository.getUsersConversations(userIds);
    return conversations.length > 0 ? conversations[0] : null;
  }

  async markConversationAsSeen(
    conversationId: number,
    userId?: string,
    date = new Date(),
  ): Promise<ConversationEntity | null> {
    const join = ['participants', 'participants.user', 'lastMessage'].join(',');

    const conversation = await this.findOneById(conversationId, join);

    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    const participant = conversation?.participants.find(
      (p) => p.userId === userId,
    );
    if (!participant) {
      throw new BadRequestException(
        'User is not a participant of the conversation',
      );
    }
    await this.conversationUserService.update(participant.id, {
      lastCheck: date,
    });

    return this.findOneById(conversationId, join);
  }

  async leaveConversation(
    conversationId: number,
    userId?: string,
  ): Promise<void> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const isParticipant = await this.isUserInConversation(
      conversationId,
      userId,
    );
    if (!isParticipant) {
      throw new BadRequestException(
        'User is not a participant of the conversation',
      );
    }

    await this.conversationUserService.removeByConversationAndUser(
      conversationId,
      userId,
    );
  }

  async reportConversation(
    conversationId: number,
    userId: string | undefined,
    createConversationReportDto: CreateConversationReportDto,
  ) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    const join = ['participants'].join(',');
    const conversation = await this.findOneById(conversationId, join);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.userId === userId,
    );
    if (!isParticipant) {
      throw new BadRequestException(
        'User is not a participant of the conversation',
      );
    }

    const reportedUserId = conversation.participants.find(
      (participant) => participant.userId !== userId,
    )?.userId;

    return this.conversationReportService.reportConversation(
      conversationId,
      userId,
      reportedUserId,
      createConversationReportDto,
    );
  }

  async removeSharedConversations(
    userId: string,
    otherUserId: string,
  ): Promise<void> {
    await this.conversationUserService.removeSharedConversations(
      userId,
      otherUserId,
    );
  }

  async getUnreadConversationCount(userId?: string): Promise<number> {
    if (!userId) {
      return 0;
    }

    return this.conversationUserService.countUnreadConversations(userId);
  }
}
