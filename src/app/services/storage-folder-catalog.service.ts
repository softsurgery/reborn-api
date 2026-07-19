import { Injectable } from '@nestjs/common';
import { StorageFolderEntity } from 'src/shared/storage/entities/storage-folder.entity';
import { StorageFolderService } from 'src/shared/storage/services/storage-folder.service';
import { STORAGE_FOLDER_SYSTEMATICS } from 'src/app/constants/storage-folder-systematics.constants';

const DEFAULT_ROOT_FOLDERS = [
  {
    name: 'Job Uploads',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.JOB_UPLOADS,
  },
  {
    name: 'Profile Pictures',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_PROFILE_PICTURES,
  },
  {
    name: 'Cover Pictures',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_COVERS,
  },
  {
    name: 'User Uploads',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_UPLOADS,
  },
  {
    name: 'Public Resources',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.PUBLIC_RESOURCES,
  },
  {
    name: 'Chat Attachments',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.CHAT_ATTACHMENTS,
  },
  {
    name: 'Temporary',
    systematicName: STORAGE_FOLDER_SYSTEMATICS.TEMPORARY,
  },
] as const;

@Injectable()
export class StorageFolderCatalogService {
  constructor(private readonly storageFolderService: StorageFolderService) {}

  getDefaultRootFolders() {
    return DEFAULT_ROOT_FOLDERS;
  }

  async seedDefaultRootFolders(): Promise<StorageFolderEntity[]> {
    return Promise.all(
      DEFAULT_ROOT_FOLDERS.map((folder) =>
        this.storageFolderService.findOrCreate(folder),
      ),
    );
  }

  async ensurePublicResourcesFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'Public Resources',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.PUBLIC_RESOURCES,
    });
  }

  async ensureTemporaryFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'Temporary',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.TEMPORARY,
    });
  }
}
