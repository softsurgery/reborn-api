import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageRepository } from './repositories/storage.repository';
import { StorageEntity } from './entities/storage.entity';
import { StorageFolderEntity } from './entities/storage-folder.entity';
import { StorageFolderRepository } from './repositories/storage-folder.repository';
import { StorageFolderService } from './services/storage-folder.service';
import { storageProvider } from './providers/storage.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [
    storageProvider,
    StorageRepository,
    StorageFolderRepository,
    StorageFolderService,
  ],
  exports: [storageProvider, StorageFolderService],
  imports: [
    TypeOrmModule.forFeature([StorageEntity, StorageFolderEntity]),
    ConfigModule,
  ],
})
export class StorageModule {}
