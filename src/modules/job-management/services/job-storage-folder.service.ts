import { Injectable } from '@nestjs/common';
import { StorageFolderEntity } from 'src/shared/storage/entities/storage-folder.entity';
import { StorageFolderService } from 'src/shared/storage/services/storage-folder.service';
import {
  STORAGE_FOLDER_SYSTEMATICS,
  jobUploadFolderSystematic,
} from 'src/app/constants/storage-folder-systematics.constants';

@Injectable()
export class JobStorageFolderService {
  constructor(private readonly storageFolderService: StorageFolderService) {}

  async ensureJobUploadFolder(jobId: string): Promise<StorageFolderEntity> {
    const parent = await this.storageFolderService.findOrCreate({
      name: 'Job Uploads',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.JOB_UPLOADS,
    });

    const folder = await this.storageFolderService.findOrCreate({
      name: jobId,
      systematicName: jobUploadFolderSystematic(jobId),
      parentId: parent.id,
    });

    if (folder.name !== jobId) {
      return this.storageFolderService.updateFolder(folder.id, { name: jobId });
    }

    return folder;
  }

  async assignJobUploads(uploadIds: number[], jobId: string): Promise<void> {
    if (!uploadIds.length) return;

    const folder = await this.ensureJobUploadFolder(jobId);
    await this.storageFolderService.assignFilesToFolder(uploadIds, folder.id);
  }
}
