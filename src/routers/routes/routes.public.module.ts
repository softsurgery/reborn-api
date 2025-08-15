import { Module } from '@nestjs/common';
import { ContentModule } from 'src/modules/content/content.module';
import { RegionController } from 'src/modules/content/region/controllers/region.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [RegionController],
  providers: [],
  exports: [],
  imports: [ContentModule, LoggerModule],
})
export class RoutesPublicModule {}
