import { Module } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [],
  providers: [NotificationRepository, NotificationService],
  exports: [NotificationRepository, NotificationService],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
})
export class NotificationModule {}
