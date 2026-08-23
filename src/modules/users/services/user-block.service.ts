import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { UserBlockEntity } from '../entities/user-block.entity';
import { UserBlockRepository } from '../repositories/user-block.repository';

@Injectable()
export class UserBlockService extends AbstractCrudService<UserBlockEntity> {
  constructor(private readonly userBlockRepository: UserBlockRepository) {
    super(userBlockRepository);
  }

  async findBlock(
    userId: string,
    blockedUserId: string,
  ): Promise<UserBlockEntity | null> {
    return this.userBlockRepository.findOne({
      where: { userId, blockedUserId },
    });
  }

  async blockUser(
    userId: string,
    blockedUserId: string,
  ): Promise<UserBlockEntity> {
    if (userId === blockedUserId) {
      throw new BadRequestException('You cannot block yourself.');
    }

    const existing = await this.findBlock(userId, blockedUserId);
    if (existing) {
      return existing;
    }

    return this.userBlockRepository.save({ userId, blockedUserId });
  }
}
