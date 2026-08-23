import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Not } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { MessageRepository } from '../repositories/message.repository';
import { MessageEntity } from '../entities/message.entity';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MessageUploadService } from './message-upload.service';
import { MessageLinkService } from './message-link.service';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { MessageVariant } from '../enums/message-variant.enum';
import { CreateMessageDto } from '../dtos/message/create-message.dto';
import { extractMessageLinks } from '../utils/extract-message-links';

export const MESSAGE_DEFAULT_RELATIONS = 'uploads,uploads.upload,links';

@Injectable()
export class MessageService extends AbstractCrudService<MessageEntity> {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageUploadService: MessageUploadService,
    private readonly messageLinkService: MessageLinkService,
    private readonly storageService: StorageService,
  ) {
    super(messageRepository);
  }

  async findPaginatedConversationMessages(
    query: IQueryObject,
    conversationId?: number,
  ): Promise<PageDto<MessageEntity>> {
    const queryBuilder = new QueryBuilder(this.messageRepository.getMetadata());
    const queryOptions = queryBuilder.build({
      ...query,
      sort: query.sort ?? 'createdAt,DESC',
      join: query.join ?? MESSAGE_DEFAULT_RELATIONS,
    });

    queryOptions.where = Array.isArray(queryOptions.where)
      ? queryOptions.where.map((where) => ({ ...where, conversationId }))
      : { ...(queryOptions.where || {}), conversationId };

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
    excludeStatic = true,
  ): Promise<MessageEntity | null> {
    const where: FindOptionsWhere<MessageEntity> = {
      conversationId,
    };

    if (excludeStatic) {
      where.content = Not('');
    }

    const messages = await this.messageRepository.findAll({
      where,
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    return messages.length > 0 ? messages[0] : null;
  }

  private resolveVariantFromUploads(
    mimetypes: string[],
  ): MessageVariant.IMAGE | MessageVariant.VIDEO | MessageVariant.FILE {
    const hasVideo = mimetypes.some((mimetype) =>
      mimetype.startsWith('video/'),
    );
    const hasImage = mimetypes.some((mimetype) =>
      mimetype.startsWith('image/'),
    );
    const hasFile = mimetypes.some(
      (mimetype) =>
        !mimetype.startsWith('video/') && !mimetype.startsWith('image/'),
    );

    const mediaKinds = [hasVideo, hasImage, hasFile].filter(Boolean).length;
    if (mediaKinds > 1) {
      throw new BadRequestException(
        'Messages cannot contain mixed upload types',
      );
    }

    if (hasVideo) return MessageVariant.VIDEO;
    if (hasImage) return MessageVariant.IMAGE;
    if (hasFile) return MessageVariant.FILE;

    throw new BadRequestException('Unsupported upload type');
  }

  @Transactional()
  async createMessage(
    createMessage: CreateMessageDto,
    userId?: string,
  ): Promise<MessageEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    if (!createMessage.conversationId) {
      throw new BadRequestException('Conversation id is required');
    }

    const { uploadIds, ...messageData } = createMessage;
    const isStatic = messageData.variant === MessageVariant.STATIC;

    if (
      !isStatic &&
      !messageData.content?.trim() &&
      (!uploadIds || uploadIds.length === 0)
    ) {
      throw new BadRequestException('Message content or uploads are required');
    }

    let variant = messageData.variant ?? MessageVariant.TEXT;

    if (uploadIds?.length) {
      const uploads = await Promise.all(
        uploadIds.map((id) => this.storageService.findOneById(id)),
      );
      variant = this.resolveVariantFromUploads(
        uploads.map((upload) => upload.mimetype),
      );
    }

    const message = await this.save({
      ...messageData,
      content: messageData.content?.trim() || undefined,
      variant,
      userId,
    });

    if (uploadIds?.length) {
      await this.messageUploadService.saveMany(
        uploadIds.map((uploadId, index) => ({
          messageId: message.id,
          uploadId,
          order: index,
        })),
      );
    }

    const extractedLinks = extractMessageLinks(message.content);
    if (extractedLinks.length) {
      await this.messageLinkService.saveMany(
        extractedLinks.map((link) => ({
          messageId: message.id,
          ...link,
        })),
      );
    }

    const savedMessage = await this.findOneById(
      message.id,
      MESSAGE_DEFAULT_RELATIONS,
    );
    if (!savedMessage) {
      throw new BadRequestException('Failed to load created message');
    }
    return savedMessage;
  }
}
