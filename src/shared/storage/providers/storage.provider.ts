import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageRepository } from '../repositories/storage.repository';
import { StorageService } from '../services/storage.service';
import { MinioStorageService } from '../services/s3-storage.service';

export const storageProvider = {
  provide: StorageService,
  inject: [ConfigService, StorageRepository],
  useFactory: (
    configService: ConfigService,
    storageRepository: StorageRepository,
  ) => {
    const driver = configService.get<string>('s3.driver') || 'local';
    console.log('Storage driver detected:', driver);
    if (driver === 'minio') {
      console.log('Using MinioStorageService');
      return new MinioStorageService(storageRepository, configService);
    }
    console.log('Using LocalStorageService');
    return new LocalStorageService(storageRepository, configService);
  },
};
