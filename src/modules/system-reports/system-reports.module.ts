import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfoEntity } from './entities/device-info.entity';
import { DeviceInfoRepository } from './repositories/device-info.repository';
import { DeviceInfoService } from './services/device-info.service';
import { FeedbackEntity } from './entities/feedback.entity';
import { BugEntity } from './entities/bug.entity';
import { FeedbackRepository } from './repositories/feedback.repository';
import { BugRepository } from './repositories/bug.repository';
import { FeedbackService } from './services/feedback.service';
import { BugService } from './services/bug.service';

@Module({
  controllers: [],
  providers: [
    DeviceInfoRepository,
    DeviceInfoService,
    FeedbackRepository,
    FeedbackService,
    BugRepository,
    BugService,
  ],
  exports: [
    DeviceInfoRepository,
    FeedbackRepository,
    BugRepository,
    DeviceInfoService,
    FeedbackService,
    BugService,
  ],
  imports: [
    TypeOrmModule.forFeature([DeviceInfoEntity, FeedbackEntity, BugEntity]),
  ],
})
export class SystemReportsModule {}
