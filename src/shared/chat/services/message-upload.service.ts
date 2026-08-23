import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { MessageUploadEntity } from '../entities/message-upload.entity';
import { CreateMessageUploadDto } from '../dtos/message-upload/create-message-upload.dto';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { MessageUploadRepository } from '../repositories/message-upload.repository';

@Injectable()
export class MessageUploadService extends AbstractCrudService<MessageUploadEntity> {
  constructor(
    private readonly messageUploadRepository: MessageUploadRepository,
    private readonly storageService: StorageService,
  ) {
    super(messageUploadRepository);
  }

  @Transactional()
  async save(createMessageUploadDto: CreateMessageUploadDto) {
    if (createMessageUploadDto.uploadId) {
      await this.storageService.confirm(createMessageUploadDto.uploadId);
    }
    return this.messageUploadRepository.save(createMessageUploadDto);
  }

  @Transactional()
  async saveMany(createMessageUploadDto: CreateMessageUploadDto[]) {
    await Promise.all(
      createMessageUploadDto.map(async (dto) => {
        if (dto.uploadId) await this.storageService.confirm(dto.uploadId);
      }),
    );
    return this.messageUploadRepository.saveMany(createMessageUploadDto);
  }
}
