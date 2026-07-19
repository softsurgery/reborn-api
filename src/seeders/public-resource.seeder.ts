import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { StorageFolderCatalogService } from 'src/app/services/storage-folder-catalog.service';
import * as fs from 'fs';
import * as path from 'path';
import { STORAGE_SYSTEMATICS } from 'src/app/constants/storage-systematics.constants';

@Injectable()
export class PublicResourceSeedCommand {
  constructor(
    private readonly storageService: StorageService,
    private readonly storageFolderCatalogService: StorageFolderCatalogService,
  ) {}

  @Command({
    command: 'seed:public-resource',
    describe: 'seed public resources like logo',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of public resources...');
    //=============================================================================================

    const resources = [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '..', 'assets', 'images', 'logo.png'),
        mimetype: 'image/png',
      },
    ];

    for (const resource of resources) {
      if (fs.existsSync(resource.path)) {
        const existing = await this.storageService.findBySystematicName(
          STORAGE_SYSTEMATICS.APPLICATION_LOGO,
        );

        if (!existing) {
          const publicFolder =
            await this.storageFolderCatalogService.ensurePublicResourcesFolder();

          const buffer = fs.readFileSync(resource.path);
          const file = {
            fieldname: 'file',
            originalname: resource.filename,
            encoding: '7bit',
            mimetype: resource.mimetype,
            size: buffer.length,
            buffer: buffer,
            destination: '',
            filename: resource.filename,
            path: resource.path,
            stream: null as unknown as NodeJS.ReadableStream,
          } as Express.Multer.File;

          const upload = await this.storageService.store(
            file,
            false,
            false,
            STORAGE_SYSTEMATICS.APPLICATION_LOGO,
            publicFolder.id,
          );
          console.log(
            `✅ Uploaded ${resource.filename} with slug: ${upload.slug}`,
          );
        } else {
          console.log(`ℹ️ ${resource.filename} is already seeded.`);
        }
      } else {
        console.log(`❌ ${resource.filename} not found at ${resource.path}`);
      }
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
