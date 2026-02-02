import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageRepository } from './repositories/storage.repository';
import { StorageEntity } from './entities/storage.entity';
import { storageProvider } from './providers/storage.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [storageProvider, StorageRepository],
  exports: [storageProvider],
  imports: [TypeOrmModule.forFeature([StorageEntity]), ConfigModule],
})
export class StorageModule {}
