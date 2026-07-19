import { Module } from '@nestjs/common';
import { StorageModule } from 'src/shared/storage/storage.module';
import { StorageFolderCatalogService } from './services/storage-folder-catalog.service';

@Module({
  imports: [StorageModule],
  providers: [StorageFolderCatalogService],
  exports: [StorageFolderCatalogService],
})
export class AppStorageFolderModule {}
