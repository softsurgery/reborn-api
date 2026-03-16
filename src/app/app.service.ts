import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/shared/storage/services/storage.service';

@Injectable()
export class AppService {
  constructor(private readonly storageService: StorageService) {}
  getHealth() {
    return {
      message: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  getStorageType() {
    return this.storageService.getStorageType();
  }
}
