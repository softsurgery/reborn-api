import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfoEntity } from './entities/device-info.entity';
import { DeviceInfoRepository } from './repositories/device-info.repository';
import { DeviceInfoService } from './services/device-info.service';

@Module({
  controllers: [],
  providers: [DeviceInfoRepository, DeviceInfoService],
  exports: [DeviceInfoRepository, DeviceInfoService],
  imports: [TypeOrmModule.forFeature([DeviceInfoEntity])],
})
export class SystemReportsModule {}
