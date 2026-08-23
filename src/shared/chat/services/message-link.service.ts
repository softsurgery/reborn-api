import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { MessageLinkEntity } from '../entities/message-link.entity';
import { CreateMessageLinkDto } from '../dtos/message-link/create-message-link.dto';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MessageLinkRepository } from '../repositories/message-link.repository';

@Injectable()
export class MessageLinkService extends AbstractCrudService<MessageLinkEntity> {
  constructor(private readonly messageLinkRepository: MessageLinkRepository) {
    super(messageLinkRepository);
  }

  @Transactional()
  async saveMany(createMessageLinkDto: CreateMessageLinkDto[]) {
    if (!createMessageLinkDto.length) {
      return [];
    }

    return this.messageLinkRepository.saveMany(createMessageLinkDto);
  }
}
