import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { UploadRepository } from './repositories/upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from './entities/upload.entity';

@Module({
  controllers: [],
  providers: [UploadService, UploadRepository],
  exports: [UploadService],
  imports: [TypeOrmModule.forFeature([UploadEntity])],
})
export class UploadModule {}
