import { Injectable } from '@nestjs/common';
import { StorageFolderEntity } from 'src/shared/storage/entities/storage-folder.entity';
import { StorageFolderService } from 'src/shared/storage/services/storage-folder.service';
import { STORAGE_FOLDER_SYSTEMATICS } from 'src/app/constants/storage-folder-systematics.constants';

@Injectable()
export class UserStorageFolderService {
  constructor(private readonly storageFolderService: StorageFolderService) {}

  async ensureProfilePicturesFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'Profile Pictures',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_PROFILE_PICTURES,
    });
  }

  async ensureCoverPicturesFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'Cover Pictures',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_COVERS,
    });
  }

  async ensureUserUploadsFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'User Uploads',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_UPLOADS,
    });
  }

  async assignProfilePicture(uploadId: number): Promise<void> {
    const folder = await this.ensureProfilePicturesFolder();
    await this.storageFolderService.assignFileToFolder(uploadId, folder.id);
  }

  async assignCoverPicture(uploadId: number): Promise<void> {
    const folder = await this.ensureCoverPicturesFolder();
    await this.storageFolderService.assignFileToFolder(uploadId, folder.id);
  }

  async assignUserUploads(uploadIds: number[]): Promise<void> {
    if (!uploadIds.length) return;

    const folder = await this.ensureUserUploadsFolder();
    await this.storageFolderService.assignFilesToFolder(uploadIds, folder.id);
  }
}
