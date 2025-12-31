import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [LoggerModule],
})
export class RoutesPublicModule {}
