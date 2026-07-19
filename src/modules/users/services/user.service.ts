import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { UserUploadService } from './user-upload.service';
import { UserEntity } from '../entities/user.entity';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { UserUploadEntity } from '../entities/user-upload.entity';
import { AbstractUserService } from 'src/shared/abstract-user-management/services/abstract-user.service';
import { hashPassword } from 'src/shared/helpers/hash.utils';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { CreateUserUploadDto } from '../dtos/user-upload/create-user-upload.dto';
import { UpdateUserUploadDto } from '../dtos/user-upload/update-user-upload.dto';
import { DeepPartial } from 'typeorm';
import { UserStorageFolderService } from './user-storage-folder.service';

@Injectable()
export class UserService extends AbstractUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userUploadService: UserUploadService,
    private readonly storageService: StorageService,
    private readonly userStorageFolderService: UserStorageFolderService,
  ) {
    super(userRepository);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async extendedSave(
    createUserDto: DeepPartial<UserEntity>,
  ): Promise<UserEntity> {
    const { ...rest } = createUserDto;
    if (createUserDto.pictureId)
      await this.storageService.confirm(createUserDto.pictureId);

    const user = await this.userRepository.save({
      ...rest,
      password: rest.password ? await hashPassword(rest.password) : undefined,
    });

    if (createUserDto.pictureId) {
      await this.userStorageFolderService.assignProfilePicture(
        createUserDto.pictureId,
      );
    }

    return user;
  }

  @Transactional()
  async extendedUpdate(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const { uploads, ...rest } = updateUserDto;
    const existingUser = (await this.findOneById(id)) as UserEntity;
    if (!existingUser) throw new UserNotFoundException();

    await this.userRepository.update(id, rest);
    //confirm new picture
    if (
      updateUserDto.pictureId &&
      updateUserDto.pictureId != existingUser.pictureId
    ) {
      await this.storageService.confirm(updateUserDto.pictureId);
      if (existingUser.pictureId)
        await this.storageService.delete(existingUser.pictureId);

      await this.userStorageFolderService.assignProfilePicture(
        updateUserDto.pictureId,
      );
    }

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['uploads'],
    });

    if (!updatedUser) throw new UserNotFoundException();

    const existingUploads = updatedUser?.uploads?.map((j: UserUploadEntity) => {
      return {
        id: j.id,
        userId: j.userId,
        uploadId: j.uploadId,
        order: j.order,
      };
    });

    if (updateUserDto.uploads) {
      await this.userRepository.updateJunctionAssociations<
        Pick<UserUploadEntity, 'id' | 'userId' | 'uploadId' | 'order'>
      >({
        existingItems: existingUploads || [],
        updatedItems:
          uploads?.map((upload, index) => ({
            id: upload.id,
            userId: id,
            uploadId: upload.uploadId,
            order: index,
          })) || [],
        keys: ['userId', 'uploadId'],
        onDelete: async (id: number) => this.userUploadService.softDelete(id),
        onCreate: async (j: CreateUserUploadDto) =>
          this.userUploadService.save({
            userId: id,
            uploadId: j.uploadId,
            order: j.order,
          }),
        onUpdate: async (id: number, item: UpdateUserUploadDto) =>
          this.userUploadService.update(id, item),
      });
    }

    return updatedUser;
  }

  async updateCover(id: string, coverId: number): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new UserNotFoundException();

    if (coverId && coverId != user.coverId) {
      await this.storageService.confirm(coverId);
      if (user.coverId) await this.storageService.delete(user.coverId);

      await this.userStorageFolderService.assignCoverPicture(coverId);
    }

    return this.userRepository.update(id, { coverId });
  }
}
