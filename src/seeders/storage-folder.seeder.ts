import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { StorageFolderService } from 'src/shared/storage/services/storage-folder.service';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { StorageFolderCatalogService } from 'src/app/services/storage-folder-catalog.service';
import { JobStorageFolderService } from 'src/modules/job-management/services/job-storage-folder.service';
import { UserStorageFolderService } from 'src/modules/users/services/user-storage-folder.service';
import { JobRepository } from 'src/modules/job-management/repositories/job.repository';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { STORAGE_SYSTEMATICS } from 'src/app/constants/storage-systematics.constants';

@Injectable()
export class StorageFolderSeedCommand {
  constructor(
    private readonly storageFolderCatalogService: StorageFolderCatalogService,
    private readonly storageFolderService: StorageFolderService,
    private readonly jobStorageFolderService: JobStorageFolderService,
    private readonly userStorageFolderService: UserStorageFolderService,
    private readonly storageService: StorageService,
    private readonly jobRepository: JobRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Command({
    command: 'seed:storage-folders',
    describe: 'seed default storage folders and organize existing uploads',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting storage folder seeding...');

    for (const folder of this.storageFolderCatalogService.getDefaultRootFolders()) {
      await this.storageFolderService.findOrCreate(folder);
      console.log(`✅ Ensured folder: ${folder.name}`);
    }

    const jobs = await this.jobRepository.findAll({
      relations: ['uploads'],
    });

    for (const job of jobs) {
      const uploadIds =
        job.uploads?.map((upload) => upload.uploadId).filter(Boolean) || [];

      if (uploadIds.length) {
        await this.jobStorageFolderService.assignJobUploads(
          uploadIds,
          job.id,
        );
        console.log(
          `✅ Organized ${uploadIds.length} file(s) for job "${job.title}"`,
        );
      }
    }

    const users = await this.userRepository.findAll({
      relations: ['uploads'],
    });

    for (const user of users) {
      if (user.pictureId) {
        await this.userStorageFolderService.assignProfilePicture(
          user.pictureId,
        );
      }

      if (user.coverId) {
        await this.userStorageFolderService.assignCoverPicture(user.coverId);
      }

      const galleryUploadIds =
        user.uploads?.map((upload) => upload.uploadId).filter(Boolean) || [];

      if (galleryUploadIds.length) {
        await this.userStorageFolderService.assignUserUploads(galleryUploadIds);
      }
    }

    const publicResource = await this.storageService.findBySystematicName(
      STORAGE_SYSTEMATICS.APPLICATION_LOGO,
    );

    if (publicResource) {
      const publicFolder =
        await this.storageFolderCatalogService.ensurePublicResourcesFolder();
      await this.storageFolderService.assignFileToFolder(
        publicResource.id,
        publicFolder.id,
      );
      console.log('✅ Organized public resources');
    }

    const temporaryUploads = await this.storageService.findTemporary();

    if (temporaryUploads.length) {
      const temporaryFolder =
        await this.storageFolderCatalogService.ensureTemporaryFolder();
      await this.storageFolderService.assignFilesToFolder(
        temporaryUploads.map((upload) => upload.id),
        temporaryFolder.id,
      );
      console.log(`✅ Organized ${temporaryUploads.length} temporary file(s)`);
    }

    const end = new Date();
    console.log(
      `✅ Storage folder seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
