import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { LogRepository } from './repositories/log.repository';
import { LogInterceptor } from './decorators/logger.interceptor';

@Module({
  controllers: [],
  providers: [LogRepository, LoggerService, LogInterceptor],
  exports: [LoggerService, LogInterceptor],
  imports: [TypeOrmModule.forFeature([LogEntity])],
})
export class LoggerModule {}
