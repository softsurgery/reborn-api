import { Module } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './services/notification.service';
import { NotificationInterceptor } from './decorators/notification.interceptor';

@Module({
  controllers: [],
  providers: [
    NotificationRepository,
    NotificationService,
    NotificationInterceptor,
  ],
  exports: [
    NotificationRepository,
    NotificationService,
    NotificationInterceptor,
  ],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
})
export class NotificationModule {}
